import os as _os
HERE=_os.path.dirname(_os.path.abspath(__file__))
import sys, math; sys.path.insert(0,HERE)
from lib import *
from g_profile import crown4, user_square, _bulge

def star_pts(cx,cy,ro,ri,rot=-90):
    P=[]
    for k in range(10):
        a=math.radians(rot+k*36); r=ro if k%2==0 else ri
        P.append((cx+r*math.cos(a), cy+r*math.sin(a)))
    return P
def rot(p,c,deg):
    a=math.radians(deg); x,y=p[0]-c[0],p[1]-c[1]
    return (c[0]+x*math.cos(a)-y*math.sin(a), c[1]+x*math.sin(a)+y*math.cos(a))

# --- info -------------------------------------------------------------
def info(x):
    R,dy,dr,y1,y2,w=x
    return [("F",circle(12,12,R),"C"),("F",circle(12,dy,dr),"D"),("S",line((12,y1),(12,y2)),w,"D")]
X_INFO=[11,6.8,1.2,11.2,17.0,2.1]

# --- help -------------------------------------------------------------
def help_(x):
    R,sx,hw,y1,k1,k2,k3,sl,w,yd,rd=x
    d=(f"M{f(12+sx-hw)} {f(y1)}a{f(hw)} {f(hw)} 0 1 1 {f(2*hw)} 0"
       f"c0 {f(k1)} {f(-hw)} {f(k2)} {f(-hw)} {f(k3)}v{f(sl)}")
    return [("F",circle(12,12,R),"C"),("S",d,w,"D"),("F",circle(12+sx,yd,rd),"D")]
X_HELP=[11,0.3,2.9,8.9,2.0,1.4,3.6,0.8,2.1,16.0,1.15]

# --- heart ------------------------------------------------------------
def heart(x):
    dx,cy,rr,yb,rb,th,rs=x
    t=math.radians(th)
    L=(12-dx-rr*math.cos(t), cy+rr*math.sin(t)); Rt=(12+dx+rr*math.cos(t), cy+rr*math.sin(t))
    P=[L,(12,cy),Rt,(12,yb)]
    return [("F",circle(12-dx,cy,rr),"C"),("F",circle(12+dx,cy,rr),"C"),("F",rpoly(P,[rs,0,rs,rb]),"C")]
X_HEART=[4.9,7.4,5.5,20.4,1.6,40,0.5]

# --- chat with dots ---------------------------------------------------
def chat_dots(x):
    cx,cy,R,tx,ty,ta,tb,rt,dy,dr,dsp=x
    # tail: a rounded wedge from the bubble's lower-left rim to the tip
    a1=math.radians(ta); a2=math.radians(tb)
    P=[(cx+R*math.cos(a1),cy+R*math.sin(a1)),(tx,ty),(cx+R*math.cos(a2),cy+R*math.sin(a2)),(cx,cy)]
    return [("F",circle(cx,cy,R),"C"),("F",rpoly(P,[0,rt,0,0]),"C"),
            ("F",circle(cx-dsp,dy,dr),"D"),("F",circle(cx,dy,dr),"D"),("F",circle(cx+dsp,dy,dr),"D")]
X_CHATD=[12.4,11.6,10.0,1.6,22.4,145,100,0.8,12.0,1.45,5.7]

# --- chat square with lines (tail bottom centre) ----------------------
def chat_lines(x):
    cy,w,h,n,tw,tb,rt,l1y,l1w,l2y,l2w,l2dx,lw=x
    by=cy+h/2-1.0
    T=[(12-tw,by),(12+tw,by),(12,tb)]
    return [("F",squircle(12,cy,w,h,n),"C"),("F",rpoly(T,[0,0,rt]),"C"),
            ("S",line((12-l1w/2,l1y),(12+l1w/2,l1y)),lw,"D"),
            ("S",line((12+l2dx-l2w/2,l2y),(12+l2dx+l2w/2,l2y)),lw,"D")]
X_CHATL=[10.0,20.6,17.8,3.2,3.0,22.3,0.9,7.8,8.2,11.8,5.1,-1.6,2.1]

# --- squircle download ------------------------------------------------
def download_sq(x):
    w,h,n,nw,nh,sy1,sy2,ah,aw,w2=x
    return [("F",squircle(12,12,w,h,n),"C"),
            ("S",line((12,12-h/2-1),(12,12-h/2+nh)),nw,"D"),
            ("S",line((12,sy1),(12,sy2)),w2,"D"),
            ("S",line((12-aw,sy2-ah),(12,sy2),(12+aw,sy2-ah)),w2,"D")]
X_DL=[20.9,20.9,3.2,1.9,1.6,10.2,18.2,3.4,3.4,2.1]

# --- chart squircle ---------------------------------------------------
def chart(x):
    w,h,n, zx0,zy0,zx1,zy1,zx2,zy2,zx3,zy3, b1x,b1t,b2x,b2t,b3x,b3t,bb, lw=x
    return [("F",squircle(12,12,w,h,n),"C"),
            ("S",line((zx0,zy0),(zx1,zy1),(zx2,zy2),(zx3,zy3)),lw,"D"),
            ("S",line((b1x,b1t),(b1x,bb)),lw,"D"),("S",line((b2x,b2t),(b2x,bb)),lw,"D"),("S",line((b3x,b3t),(b3x,bb)),lw,"D")]
X_CHART=[20.9,20.9,3.2, 7.0,9.6,10.4,6.2,13.4,9.0,17.6,5.8, 6.6,14.0,10.9,11.3,15.1,15.2,17.4, 2.1]

# --- lock -------------------------------------------------------------
def lock(x):
    sw,sx,sy_top,sy_base,bw,bh,bcy,n,kr,ky,ks,kw=x
    sh=f"M{f(12-sx)} {f(sy_base)}V{f(sy_top+sx)}a{f(sx)} {f(sx)} 0 0 1 {f(2*sx)} 0V{f(sy_base)}"
    return [("S",sh,sw,"C"),("F",squircle(12,bcy,bw,bh,n),"C"),
            ("F",circle(12,ky,kr),"D"),("S",line((12,ky),(12,ky+ks)),kw,"D")]
X_LOCK=[2.6,4.8,2.2,10,20.6,13.0,15.4,3.4,1.45,13.8,2.6,1.6]

# --- shield -----------------------------------------------------------
def shield(x):
    w,yt,dip,s1,ym,yb,rt,rc,rsd,rb,bul, c0x,c0y,c1x,c1y,c2x,c2y,lw=x
    TL=(12-w/2,yt+s1); T=(12,yt+dip); TR=(12+w/2,yt+s1); MR=(12+w/2,ym); B=(12,yb); ML=(12-w/2,ym)
    P=[T,TR,MR,_bulge(MR,B,bul),B,_bulge(B,ML,bul),ML,TL]
    R=[rt,rc,rsd,6,rb,6,rsd,rc]
    return [("F",rpoly(P,R),"C"),("S",line((c0x,c0y),(c1x,c1y),(c2x,c2y)),lw,"D")]
X_SHIELD=[18.8,1.4,0.0,2.2,12.5,22.1,2.5,2.5,3.0,2.2,1.3, 8.4,12.4,10.9,14.9,15.6,9.8, 2.1]

# --- trash ------------------------------------------------------------
def trash(x):
    hw,hy,hh, lw_,ly,lh, tw,bwid,by,rtop,rbot,bul, s1x,s2x,sy1,sy2,sw=x
    body=[(12-tw,ly+lh/2),(12+tw,ly+lh/2),(12+bwid,by),(12-bwid,by)]
    B=[body[0],body[1],_bulge(body[1],body[2],-bul),body[2],body[3],_bulge(body[3],body[0],-bul)]
    return [("F",rrect(12-hw/2,hy-hh/2,hw,hh,hh/2),"C"),
            ("F",rrect(12-lw_/2,ly-lh/2,lw_,lh,lh/2),"C"),
            ("F",rpoly(B,[rtop,rtop,6,rbot,rbot,6]),"C"),
            ("S",line((s1x,sy1),(s1x,sy2)),sw,"D"),("S",line((s2x,sy1),(s2x,sy2)),sw,"D")]
X_TRASH=[6.3,3.0,1.8, 17.5,5.6,2.4, 7.4,6.0,21.6,0.6,3.2,0.3, 9.8,13.9,11.2,15.4,2.2]

# --- bag with star ----------------------------------------------------
def bag_star(x):
    hx,hyt,hyb,hw, tw,ty,bw,by,rt,rb,bul, sy,sro,sri,srr=x
    handle=f"M{f(12-hx)} {f(hyb)}V{f(hyt+hx)}a{f(hx)} {f(hx)} 0 0 1 {f(2*hx)} 0V{f(hyb)}"
    P=[(12-tw,ty),(12+tw,ty),(12+bw,by),(12-bw,by)]
    B=[P[0],P[1],_bulge(P[1],P[2],-bul),P[2],P[3],_bulge(P[3],P[0],-bul)]
    return [("S",handle,hw,"C"),("F",rpoly(B,[rt,rt,8,rb,rb,8]),"C"),
            ("F",rpoly(star_pts(12,sy,sro,sri),srr),"D")]
X_BAG=[3.1,2.4,9.0,2.2, 9.2,7.6,7.4,22.6,1.4,3.6,0.4, 15.3,3.5,1.6,0.25]

# --- clipboard --------------------------------------------------------
def clipboard(x):
    cy,w,h,n, cw,ch,cty,cr,gap, l1y,l1w,l2y,l2w,l2dx,lw=x
    return [("F",squircle(12,cy,w,h,n),"C"),
            ("F",rrect(12-cw/2-gap,cty-gap,cw+2*gap,ch+2*gap,cr+gap),"D"),
            ("F",rrect(12-cw/2,cty,cw,ch,cr),"C"),
            ("S",line((12-l1w/2,l1y),(12+l1w/2,l1y)),lw,"D"),
            ("S",line((12+l2dx-l2w/2,l2y),(12+l2dx+l2w/2,l2y)),lw,"D")]
X_CLIP=[13.5,18.9,18.4,3.2, 6.3,4.0,2.1,1.5,1.3, 11.3,6.0,15.6,4.2,-1.0,2.1]

# --- calendar ---------------------------------------------------------
def calendar(x):
    cy,w,h,n, hx,hw_,hh,hty, by,bh, r1,r2,c1,c2,c3,ds,dr=x
    els=[("S",line((12-hx,hty),(12-hx,hty+hh)),hw_,"C"),("S",line((12+hx,hty),(12+hx,hty+hh)),hw_,"C"),
         ("F",squircle(12,cy,w,h,n),"C"),("F",rrect(0,by-bh/2,24,bh,0),"D")]
    for (yy,xs) in ((r1,(c1,c2,c3)),(r2,(c1,c2))):
        for xx in xs: els.append(("F",rrect(xx-ds/2,yy-ds/2,ds,ds,dr),"D"))
    return els
X_CAL=[12.9,20.7,20.0,3.2, 5.2,1.9,2.2,1.6, 8.3,2.0, 12.5,16.7,7.8,12.0,16.1,2.1,0.6]

# --- camera -----------------------------------------------------------
def camera(x):
    cy,w,h,n, hmw,hmh,hmy,hmr, lx,ly,lr, dx_,dy_,drr=x
    return [("F",rrect(12-hmw/2,hmy,hmw,hmh,hmr),"C"),("F",squircle(12,cy,w,h,n),"C"),
            ("F",circle(lx,ly,lr),"D"),("F",circle(dx_,dy_,drr),"D")]
X_CAM=[13.0,20.7,16.6,3.2, 8.4,4.0,3.1,1.6, 12.1,12.6,3.25, 18.3,7.4,1.05]

# --- mail with alert badge --------------------------------------------
def mail_badge(x):
    cy,w,h,n, vy,vdepth,vw, bx,by,bR,gap, ey1,ey2,ew,edy,edr=x
    top=cy-h/2
    return [("F",squircle(12,cy,w,h,n),"C"),
            ("S",line((12-w/2-1,top+vy-vdepth*0.2),(12,top+vy+vdepth),(12+w/2+1,top+vy-vdepth*0.2)),vw,"D"),
            ("F",circle(bx,by,bR+gap),"D"),("F",circle(bx,by,bR),"C"),
            ("S",line((bx,ey1),(bx,ey2)),ew,"D"),("F",circle(bx,edy,edr),"D")]
X_MAILB=[12.0,20.7,17.4,3.2, 2.6,4.0,2.0, 18.1,17.2,4.3,1.4, 15.3,17.2,1.4,19.1,0.75]

# --- list with plus badge ---------------------------------------------
def list_plus(x):
    bcx,bcy,w,h,n, l1y,l1x0,l1x1,l2y,l2x1,l3y,l3x1,lw, bx,by,bR,gap,pa,pw=x
    lx0=l1x0
    return [("F",squircle(bcx,bcy,w,h,n),"C"),
            ("S",line((lx0,l1y),(l1x1,l1y)),lw,"D"),("S",line((lx0,l2y),(l2x1,l2y)),lw,"D"),("S",line((lx0,l3y),(l3x1,l3y)),lw,"D"),
            ("F",circle(bx,by,bR+gap),"D"),("F",circle(bx,by,bR),"C"),
            ("S",line((bx-pa,by),(bx+pa,by)),pw,"D"),("S",line((bx,by-pa),(bx,by+pa)),pw,"D")]
X_LISTP=[10.4,10.3,19.8,19.8,3.2, 7.1,7.6,15.1,11.5,11.0,15.6,8.9,2.2, 18.2,18.2,4.4,1.5,1.8,1.9]

# --- send (paper plane) -----------------------------------------------
def send(x):
    lx,ly, tx,ty, bx_,by_, ix,iy, r1,r2,r3,r4, fx,fy,fw, wx0,wy0,wx1,wy1,wx2,wy2,wr=x
    P=[(lx,ly),(tx,ty),(bx_,by_),(ix,iy)]
    W=[(wx0,wy0),(wx1,wy1),(wx2,wy2)]
    return [("F",rpoly(P,[r1,r2,r3,r4]),"C"),("S",line((ix,iy),(fx,fy)),fw,"D"),("F",rpoly(W,wr),"C")]
X_SEND=[1.9,9.6, 22.4,2.3, 14.2,21.2, 9.6,12.1, 1.0,1.2,1.0,0.6, 19.0,5.4,1.2, 7.9,13.2,11.4,15.6,8.8,19.6,0.7]

# --- pencil with sparkle ----------------------------------------------
def pencil_spark(x):
    cx,cy,ang, u0,u1,bw,rb, ut,tr, e0,e1,er, px,py,pl,pw=x
    c=(cx,cy)
    def G(u,v): return rot((cx+u,cy+v),c,ang)
    body=[G(u0,-bw/2),G(u1,-bw/2),G(u1,bw/2),G(u0,bw/2),G(ut,0)]
    P=[body[4],body[0],body[1],body[2],body[3]]
    eras=[G(e0,-bw/2),G(e1,-bw/2),G(e1,bw/2),G(e0,bw/2)]
    return [("F",rpoly(P,[tr,0.3,rb,rb,0.3]),"C"),("F",rpoly(eras,[0.3,er,er,0.3]),"C"),
            ("S",line((px-pl,py),(px+pl,py)),pw,"C"),("S",line((px,py-pl),(px,py+pl)),pw,"C")]
X_PEN=[12.6,12.3,-45, -4.8,5.4,6.2,0.3, -9.6,1.2, 7.4,11.4,2.6, 5.4,6.0,2.6,1.9]

MODELS={
 "info":(info,X_INFO,(1,0)), "help":(help_,X_HELP,(4,4)), "heart":(heart,X_HEART,(1,3)),
 "chat_dots":(chat_dots,X_CHATD,(3,0)), "chat_lines":(chat_lines,X_CHATL,(6,3)),
 "download_sq":(download_sq,X_DL,(5,2)), "chart":(chart,X_CHART,(2,0)), "lock":(lock,X_LOCK,(2,3)),
 "shield":(shield,X_SHIELD,(6,4)), "trash":(trash,X_TRASH,(1,4)), "bag_star":(bag_star,X_BAG,(6,2)),
 "clipboard":(clipboard,X_CLIP,(6,1)), "calendar":(calendar,X_CAL,(0,3)), "camera":(camera,X_CAM,(0,4)),
 "mail_badge":(mail_badge,X_MAILB,(2,1)), "list_plus":(list_plus,X_LISTP,(0,0)), "send":(send,X_SEND,(3,1)),
 "pencil_spark":(pencil_spark,X_PEN,(0,2)),
}

# ---------- round 2 models -------------------------------------------
def mail_badge2(x):
    cx,cy,w,h,n, vy,vdepth,vw, bx,by,bR,gap, ey1,ey2,ew,edy,edr=x
    top=cy-h/2
    return [("F",squircle(cx,cy,w,h,n),"C"),
            ("S",line((cx-w/2-1,top+vy-vdepth*0.2),(cx,top+vy+vdepth),(cx+w/2+1,top+vy-vdepth*0.2)),vw,"D"),
            ("F",circle(bx,by,bR+gap),"D"),("F",circle(bx,by,bR),"C"),
            ("S",line((bx,ey1),(bx,ey2)),ew,"D"),("F",circle(bx,edy,edr),"D")]
X_MAILB2=[11.0,11.8,19.4,17.4,3.4, 3.0,4.2,2.0, 18.2,17.3,4.2,1.5, 15.3,17.3,1.3,19.2,0.7]

def calendar2(x):
    cy,w,h,n, hx,hr,hy, by,bh, r1,r2,c1,c2,c3,ds,dr=x
    els=[("F",circle(12-hx,hy,hr),"C"),("F",circle(12+hx,hy,hr),"C"),
         ("F",squircle(12,cy,w,h,n),"C"),("F",rrect(0,by-bh/2,24,bh,0),"D")]
    for (yy,xs) in ((r1,(c1,c2,c3)),(r2,(c1,c2))):
        for xx in xs: els.append(("F",rrect(xx-ds/2,yy-ds/2,ds,ds,dr),"D"))
    return els

def chat_dots2(x):
    cx,cy,R, a1,a2, tx,ty, cv, rt, dy,dr,dsp=x
    A1=(cx+R*math.cos(math.radians(a1)),cy+R*math.sin(math.radians(a1)))
    A2=(cx+R*math.cos(math.radians(a2)),cy+R*math.sin(math.radians(a2)))
    T=(tx,ty)
    P=[A1,T,_bulge(T,A2,cv),A2,(cx,cy)]
    return [("F",circle(cx,cy,R),"C"),("F",rpoly(P,[0,rt,6,0,0]),"C"),
            ("F",circle(cx-dsp,dy,dr),"D"),("F",circle(cx,dy,dr),"D"),("F",circle(cx+dsp,dy,dr),"D")]
X_CHATD2=[12.4,11.6,10.1, 150,105, 1.7,22.3, 0.8, 0.7, 12.0,1.45,5.7]

def lock2(x):
    sw,sx,sy_top,sy_base,bw,bh,bcy,n,kr,ky,ks,kw,kw2=x
    sh=f"M{f(12-sx)} {f(sy_base)}V{f(sy_top+sx)}a{f(sx)} {f(sx)} 0 0 1 {f(2*sx)} 0V{f(sy_base)}"
    stem=rpoly([(12-kw/2,ky),(12+kw/2,ky),(12+kw2/2,ky+ks),(12-kw2/2,ky+ks)],[0,0,kw2/2*0.95,kw2/2*0.95])
    return [("S",sh,sw,"C"),("F",squircle(12,bcy,bw,bh,n),"C"),
            ("F",circle(12,ky,kr),"D"),("F",stem,"D")]

def help2(x):
    R,acx,acy,ar,ts,te,k1,stx,sty,k2,sy2,w,ddx,ddy,dr=x
    ts_,te_=math.radians(ts),math.radians(te)
    P0=(acx+ar*math.cos(ts_),acy+ar*math.sin(ts_)); P1=(acx+ar*math.cos(te_),acy+ar*math.sin(te_))
    large=1 if (te-ts)>180 else 0
    tg=(-math.sin(te_),math.cos(te_))
    d=(f"M{f(P0[0])} {f(P0[1])}A{f(ar)} {f(ar)} 0 {large} 1 {f(P1[0])} {f(P1[1])}"
       f"C{f(P1[0]+tg[0]*k1)} {f(P1[1]+tg[1]*k1)} {f(stx)} {f(sty-k2)} {f(stx)} {f(sty)}V{f(sy2)}")
    return [("F",circle(12,12,R),"C"),("S",d,w,"D"),("F",circle(ddx,ddy,dr),"D")]
X_HELP3=[11,12.6,9.0,3.2,190,380,1.5,12.1,12.6,1.0,13.2,2.1,12.07,16.1,1.1]

def shield4(x):
    """Smooth, symmetric shield: a softened peak, rounded shoulders, straight
    sides, and cubic lower sides into a rounded tip. The first fit used a
    polygon with bulge points and its lower sides read as facets."""
    hw,yt,pk,yc,cr,ym,yb,k1,k2,tip, c0x,c0y,c1x,c1y,c2x,c2y,lw=x
    L,R=12-hw,12+hw
    d=(f"M{f(12-pk)} {f(yt+pk*0.45)}Q12 {f(yt)} {f(12+pk)} {f(yt+pk*0.45)}"
       f"C{f(12+hw*0.35)} {f(yc-1.2)} {f(R-cr*1.6)} {f(yc-cr*0.5)} {f(R-cr*0.6)} {f(yc-cr*0.25)}"
       f"Q{f(R)} {f(yc)} {f(R)} {f(yc+cr)}V{f(ym)}"
       f"C{f(R)} {f(ym+k1)} {f(12+hw*k2)} {f(yb-0.9)} {f(12+tip)} {f(yb-0.12)}"
       f"Q12 {f(yb+0.1)} {f(12-tip)} {f(yb-0.12)}"
       f"C{f(12-hw*k2)} {f(yb-0.9)} {f(L)} {f(ym+k1)} {f(L)} {f(ym)}V{f(yc+cr)}"
       f"Q{f(L)} {f(yc)} {f(L+cr*0.6)} {f(yc-cr*0.25)}"
       f"C{f(L+cr*1.6)} {f(yc-cr*0.5)} {f(12-hw*0.35)} {f(yc-1.2)} {f(12-pk)} {f(yt+pk*0.45)}Z")
    return [("F",d,"C"),("S",line((c0x,c0y),(c1x,c1y),(c2x,c2y)),lw,"D")]
X_SHIELD4=[9.4,1.7,1.0,4.6,1.4,11.4,22.3,5.0,0.42,0.7, 8.9,12.1,10.8,13.9,15.1,9.7,2.07]

def shield5(x):
    """Dome-topped, round-tipped shield: every join tangent-continuous, so no
    nub at the peak or the tip."""
    hw,yt,a,yc,cr,ym,yb,k1,k2, c0x,c0y,c1x,c1y,c2x,c2y,lw=x
    L,R=12-hw,12+hw
    d=(f"M12 {f(yt)}C{f(12+a)} {f(yt)} {f(R-cr*1.6)} {f(yc-cr*0.5)} {f(R-cr*0.6)} {f(yc-cr*0.25)}"
       f"Q{f(R)} {f(yc)} {f(R)} {f(yc+cr)}V{f(ym)}"
       f"C{f(R)} {f(ym+k1)} {f(12+hw*k2)} {f(yb)} 12 {f(yb)}"
       f"C{f(12-hw*k2)} {f(yb)} {f(L)} {f(ym+k1)} {f(L)} {f(ym)}V{f(yc+cr)}"
       f"Q{f(L)} {f(yc)} {f(L+cr*0.6)} {f(yc-cr*0.25)}"
       f"C{f(L+cr*1.6)} {f(yc-cr*0.5)} {f(12-a)} {f(yt)} 12 {f(yt)}Z")
    return [("F",d,"C"),("S",line((c0x,c0y),(c1x,c1y),(c2x,c2y)),lw,"D")]
X_SHIELD5=[9.41,1.4,2.6,4.98,1.47,12.5,22.4,5.4,0.3, 8.85,12.18,10.84,13.96,15.1,9.76,2.06]
