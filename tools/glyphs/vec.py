import os as _os
HERE=_os.path.dirname(_os.path.abspath(__file__))
"""Glyph elements -> one smooth vector path, with no raster step.

1. Every element becomes exact geometry (shapely): fills from their paths,
   strokes buffered with round caps and joins. Body adds, cut subtracts.
2. Corners are rounded by buffering: closing then opening at RMIN, and tips
   on the outer silhouette trimmed to RTIP (inner symbols are left alone, so
   a plus cut into a badge keeps its shape).
3. Each ring is densified and refit with cubic Beziers (Schneider), so the
   path is smooth at any size instead of faceted."""
import math, numpy as np
from shapely.geometry import Polygon, LineString, LinearRing, MultiPolygon, GeometryCollection
from shapely.ops import unary_union
from shapely import affinity
from shapely.geometry.polygon import orient
from svgelements import Path as SPath, Move, Close
Q=32
RMIN, RTIP = 0.4, 0.7

def subpaths(d, step=0.03):
    p=SPath(d); subs=[]; cur=[]; closed=False
    for seg in p:
        if isinstance(seg, Move):
            if cur: subs.append((cur,closed))
            cur=[(seg.end.x,seg.end.y)]; closed=False; continue
        if isinstance(seg, Close):
            closed=True
            if cur and (abs(cur[-1][0]-cur[0][0])>1e-6 or abs(cur[-1][1]-cur[0][1])>1e-6):
                cur.append(cur[0])
            continue
        try: L=seg.length(error=1e-4)
        except Exception: L=1.0
        n=max(2,int(math.ceil(L/step)))
        for i in range(1,n+1):
            pt=seg.point(i/n); cur.append((pt.x,pt.y))
    if cur: subs.append((cur,closed))
    return subs

def element_geom(e):
    kind=e[0]
    if kind=="F":
        polys=[Polygon(pts).buffer(0) for pts,cl in subpaths(e[1]) if len(pts)>=3]
        return unary_union(polys)
    w=e[2]; parts=[]
    for pts,cl in subpaths(e[1]):
        if len(pts)<2: continue
        g=LinearRing(pts) if cl and len(pts)>=4 else LineString(pts)
        parts.append(g.buffer(w/2,quad_segs=Q,cap_style="round",join_style="round"))
    return unary_union(parts)

def build_geom(els, t=(0,0), s=1.0):
    G=GeometryCollection()
    for e in els:
        g=element_geom(e)
        G = G.union(g) if e[-1]=="C" else G.difference(g)
    if s!=1.0: G=affinity.scale(G,s,s,origin=(12,12))
    return affinity.translate(G,t[0],t[1])

def polys(G):
    if isinstance(G,Polygon): return [G] if not G.is_empty else []
    if hasattr(G,"geoms"): return [p for g in G.geoms for p in polys(g)]
    return []

def _round_shell(shell, rmin, rtip):
    b=lambda g,r: g.buffer(r,quad_segs=Q,join_style="round")
    S=b(b(shell,rmin),-rmin)          # closing: concave corners
    S=b(b(S,-rmin),rmin)              # opening: convex corners
    O=b(b(S,-rtip),rtip); lost=S.difference(O)
    outer=unary_union([LinearRing(p.exterior.coords) for p in polys(S)])
    for c in polys(lost):
        x0,y0,x1,y1=c.bounds
        if c.area<0.35 and max(x1-x0,y1-y0)<1.6 and c.distance(outer)<1e-6:
            S=S.difference(c.buffer(1e-5))
    return S

def round_geom(G, rmin=RMIN, rtip=RTIP):
    """Round each part's silhouette; put its enclosed cut-outs back as drawn.

    Parts are rounded one at a time, so an island sitting inside another
    part's hole (a pupil, the dot in a QR finder, the coin on a card) is
    kept, and two parts are never bridged. Enclosed cut-outs already have
    round caps and are restored exactly: rounding them turned the badge
    plus into a four-leaf blob. Cuts that open to the outside (a badge ring,
    a notch) are part of the silhouette and do get rounded."""
    out=[]
    for p in polys(G):
        S=_round_shell(Polygon(p.exterior.coords), rmin, rtip)
        for r in p.interiors: S=S.difference(Polygon(r.coords))
        out.append(S)
    return unary_union(out).buffer(0)

def recentre(G):
    x0,y0,x1,y1=G.bounds
    return affinity.translate(G, 12-(x0+x1)/2, 12-(y0+y1)/2)

# ---------------- Schneider cubic fitting ----------------
def _q(b,t):  return (1-t)**3*b[0]+3*(1-t)**2*t*b[1]+3*(1-t)*t**2*b[2]+t**3*b[3]
def _q1(b,t): return 3*(1-t)**2*(b[1]-b[0])+6*(1-t)*t*(b[2]-b[1])+3*t**2*(b[3]-b[2])
def _q2(b,t): return 6*(1-t)*(b[2]-2*b[1]+b[0])+6*t*(b[3]-2*b[2]+b[1])
def _norm(v): n=np.linalg.norm(v); return v/n if n>1e-12 else v
def _chord(P):
    u=np.concatenate([[0],np.cumsum(np.linalg.norm(np.diff(P,axis=0),axis=1))]); return u/u[-1]
def _gen(P,u,tl,tr):
    A=np.zeros((len(u),2,2))
    A[:,0]=tl*(3*(1-u)**2*u)[:,None]; A[:,1]=tr*(3*(1-u)*u**2)[:,None]
    C=np.zeros((2,2)); X=np.zeros(2)
    for i in range(len(u)):
        C[0,0]+=A[i,0]@A[i,0]; C[0,1]+=A[i,0]@A[i,1]; C[1,1]+=A[i,1]@A[i,1]
        tmp=P[i]-_q([P[0],P[0],P[-1],P[-1]],u[i]); X[0]+=A[i,0]@tmp; X[1]+=A[i,1]@tmp
    C[1,0]=C[0,1]
    det=C[0,0]*C[1,1]-C[1,0]*C[0,1]
    al=(X[0]*C[1,1]-X[1]*C[0,1])/det if det else 0; ar=(C[0,0]*X[1]-C[1,0]*X[0])/det if det else 0
    L=np.linalg.norm(P[0]-P[-1]); eps=1e-6*L
    arc=np.linalg.norm(np.diff(P,axis=0),axis=1).sum()
    if al<eps or ar<eps or al>arc or ar>arc: al=ar=L/3
    return [P[0],P[0]+tl*al,P[-1]+tr*ar,P[-1]]
def _err(P,b,u):
    d=np.array([np.linalg.norm(_q(b,t)-p) for p,t in zip(P,u)]); i=int(d.argmax()); return d[i],i
def _reparam(b,P,u):
    out=[]
    for p,t in zip(P,u):
        d=_q(b,t)-p; num=(d*_q1(b,t)).sum(); den=(_q1(b,t)**2+d*_q2(b,t)).sum()
        out.append(t-num/den if den else t)
    return np.clip(np.array(out),0,1)
def _fit(P,tl,tr,tol):
    if len(P)==2:
        dd=np.linalg.norm(P[0]-P[1])/3; return [[P[0],P[0]+tl*dd,P[1]+tr*dd,P[1]]]
    u=_chord(P); b=_gen(P,u,tl,tr); e,i=_err(P,b,u)
    if e<tol: return [b]
    if e<tol*4:
        for _ in range(12):
            u=_reparam(b,P,u); b=_gen(P,u,tl,tr); e,i=_err(P,b,u)
            if e<tol: return [b]
    i=min(max(i,1),len(P)-2)
    tc=_norm(P[i-1]-P[i+1])
    return _fit(P[:i+1],tl,tc,tol)+_fit(P[i:],-tc,tr,tol)

def _num(v):
    s=f"{v:.2f}".rstrip("0").rstrip(".")
    if s in ("","-0","-"): return "0"
    if s.startswith("0."): s=s[1:]
    elif s.startswith("-0."): s="-"+s[2:]
    return s
def _pair(x,y):
    a,b=_num(x),_num(y)
    return a+(b if b.startswith("-") else " "+b)
def ring_path(coords, tol=0.02, step=0.05):
    ring=LinearRing(coords)
    ring=LinearRing(ring.segmentize(step).coords)
    P=np.array(ring.coords)[:-1]
    keep=[0]+[i for i in range(1,len(P)) if np.linalg.norm(P[i]-P[keep[-1] if False else i-1])>1e-4]
    P=P[keep]
    P=np.vstack([P,P[:1]])
    t0=_norm(P[1]-P[-2])
    beziers=_fit(P,t0,-t0,tol)
    x,y=P[0]; d=f"M{_pair(x,y)}"
    for b in beziers:
        c1,c2,e=b[1]-np.array([x,y]),b[2]-np.array([x,y]),b[3]-np.array([x,y])
        d+="c"+_pair(*c1)+" "+_pair(*c2)+" "+_pair(*e)
        # accumulate from the rounded end point so rounding never drifts
        x=x+float(_num(e[0]).replace("","") or 0) if False else x+round(e[0],2); y=y+round(e[1],2)
    return d+"z"

def geom_to_d(G, tol=0.012):
    d=""
    for p in polys(G):
        p=orient(p,1.0)
        d+=ring_path(p.exterior.coords,tol)
        for r in p.interiors: d+=ring_path(r.coords,tol)
    return d

def deviation(d, G):
    """Max distance between the emitted path and the geometry it came from."""
    from shapely.geometry import MultiLineString
    lines=[LineString(pts) for pts,cl in subpaths(d,step=0.02)]
    bnd=G.boundary
    return max(bnd.hausdorff_distance(unary_union(lines)),0)
