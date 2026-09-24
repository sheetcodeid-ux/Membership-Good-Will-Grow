import os as _os
HERE=_os.path.dirname(_os.path.abspath(__file__))
"""Geometry kit for the Good Will Grow icon set (24-unit grid).

Every glyph is a list of elements painted in order:
  ("F", d, kind)            filled path
  ("S", d, width, kind)     stroked path, round caps + joins (never a sharp end)
kind "C" = body, "D" = cut (becomes a real hole via SVG mask in the app).
"""
import math

def f(x): 
    s=f"{x:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0","") else s

def pts_path(pts, closed=True):
    """Smooth closed curve through points (Catmull-Rom -> cubic Bezier)."""
    n=len(pts); d=f"M{f(pts[0][0])} {f(pts[0][1])}"
    rng=range(n) if closed else range(n-1)
    for i in rng:
        p0=pts[(i-1)%n] if (closed or i>0) else pts[i]
        p1=pts[i]; p2=pts[(i+1)%n]
        p3=pts[(i+2)%n] if (closed or i+2<n) else p2
        c1=(p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6)
        c2=(p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6)
        d+=f"C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}"
    return d+("Z" if closed else "")

def squircle(cx,cy,w,h,n=3.2,samples=48):
    """Superellipse |x/a|^n+|y/b|^n=1 — the set's 'pillow' body (n=3.2 measured)."""
    a,b=w/2,h/2; P=[]
    for i in range(samples):
        t=2*math.pi*i/samples; c,s=math.cos(t),math.sin(t)
        P.append((cx+a*math.copysign(abs(c)**(2/n),c), cy+b*math.copysign(abs(s)**(2/n),s)))
    return pts_path(P)

def circle(cx,cy,r):
    return f"M{f(cx-r)} {f(cy)}a{f(r)} {f(r)} 0 1 0 {f(2*r)} 0a{f(r)} {f(r)} 0 1 0 {f(-2*r)} 0Z"

def rrect(x,y,w,h,r):
    r=min(r,w/2,h/2)
    return (f"M{f(x+r)} {f(y)}h{f(w-2*r)}a{f(r)} {f(r)} 0 0 1 {f(r)} {f(r)}v{f(h-2*r)}"
            f"a{f(r)} {f(r)} 0 0 1 {f(-r)} {f(r)}h{f(-(w-2*r))}a{f(r)} {f(r)} 0 0 1 {f(-r)} {f(-r)}"
            f"v{f(-(h-2*r))}a{f(r)} {f(r)} 0 0 1 {f(r)} {f(-r)}Z")

def rpoly(P, r):
    """Polygon with every vertex rounded by a tangent arc — nothing lancip.
    r: scalar or per-vertex list. Points in drawing order."""
    n=len(P); R=r if isinstance(r,(list,tuple)) else [r]*n
    out=[]
    for i in range(n):
        p0,p1,p2=P[i-1],P[i],P[(i+1)%n]
        v1=(p0[0]-p1[0],p0[1]-p1[1]); v2=(p2[0]-p1[0],p2[1]-p1[1])
        l1=math.hypot(*v1); l2=math.hypot(*v2)
        u1=(v1[0]/l1,v1[1]/l1); u2=(v2[0]/l2,v2[1]/l2)
        cosang=max(-1,min(1,u1[0]*u2[0]+u1[1]*u2[1])); ang=math.acos(cosang)
        ri=R[i]
        if ri<=0 or ang<1e-3 or abs(ang-math.pi)<1e-3:
            out.append(("P",p1)); continue
        t=ri/math.tan(ang/2); t=min(t,l1*0.49,l2*0.49); ri=t*math.tan(ang/2)
        a=(p1[0]+u1[0]*t,p1[1]+u1[1]*t); b=(p1[0]+u2[0]*t,p1[1]+u2[1]*t)
        cross=u1[0]*u2[1]-u1[1]*u2[0]
        sweep=1 if cross<0 else 0
        out.append(("A",a,b,ri,sweep))
    d=""
    for k,item in enumerate(out):
        if item[0]=="P":
            d+=("M" if k==0 else "L")+f"{f(item[1][0])} {f(item[1][1])}"
        else:
            _,a,b,ri,sw=item
            d+=("M" if k==0 else "L")+f"{f(a[0])} {f(a[1])}"
            d+=f"A{f(ri)} {f(ri)} 0 0 {sw} {f(b[0])} {f(b[1])}"
    return d+"Z"

def line(*P):
    return "M"+"L".join(f"{f(x)} {f(y)}" for x,y in P)

def to_svg(els, ink="#484949", bg="#F3F3F3", size=None, box=True):
    body=""
    for e in els:
        col=ink if e[-1]=="C" else bg
        if e[0]=="F": body+=f'<path d="{e[1]}" fill="{col}"/>'
        else: body+=f'<path d="{e[1]}" fill="none" stroke="{col}" stroke-width="{f(e[2])}" stroke-linecap="round" stroke-linejoin="round"/>'
    return body

def svg_doc(els, px=96, ink="#484949", bg="#F3F3F3"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="{px}" height="{px}">'
            f'<rect width="24" height="24" fill="{bg}"/>{to_svg(els,ink,bg)}</svg>')
