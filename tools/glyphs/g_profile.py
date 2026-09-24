import os as _os
HERE=_os.path.dirname(_os.path.abspath(__file__))
import sys; sys.path.insert(0,HERE)
from lib import *
def user_square(x):
    w,h,n,hy,hr,by,bw,bh=x
    return [("F",squircle(12,12,w,h,n),"C"),
            ("F",circle(12,hy,hr),"D"),
            ("F",rrect(12-bw/2,by-bh/2,bw,bh,bh/2),"D")]
X_US=[20.8,20.8,3.2,9.7,2.3,15.1,7.4,4.2]

def crown(x):
    (dmy,dmr,dsx,dsy,dsr, tx,ty,vx,vy,my,bx,byb, rp,rv,rb)=x
    P=[(12-tx,ty),(12-vx,vy),(12,my),(12+vx,vy),(12+tx,ty),(12+bx,byb),(12-bx,byb)]
    return [("F",circle(12,dmy,dmr),"C"),("F",circle(12-dsx,dsy,dsr),"C"),("F",circle(12+dsx,dsy,dsr),"C"),
            ("F",rpoly(P,[rp,rv,rp,rv,rp,rb,rb]),"C")]
X_CR=[5.6,2.45,7.8,7.7,2.65, 8.2,12.0,4.0,15.2,10.2,7.4,21.6, 0.8,1.0,2.4]

def crown2(x):
    (dmy,dmr,dsx,dsy,dsr, tx,ty,vx,vy,my, sx,sy, bx,byb, rt,rv,rm,rs,rb)=x
    P=[(12-tx,ty),(12-vx,vy),(12,my),(12+vx,vy),(12+tx,ty),(12+sx,sy),(12+bx,byb),(12-bx,byb),(12-sx,sy)]
    return [("F",circle(12,dmy,dmr),"C"),("F",circle(12-dsx,dsy,dsr),"C"),("F",circle(12+dsx,dsy,dsr),"C"),
            ("F",rpoly(P,[rt,rv,rm,rv,rt,rs,rb,rb,rs]),"C")]
X_CR2=[5.75,2.5,7.8,7.8,2.7, 8.4,11.2,4.0,15.0,10.6, 7.6,15.5, 7.2,21.4, 0.9,1.0,0.9,1.5,2.6]

def _bulge(a,b,amt):
    """Midpoint of a->b pushed outward (to the left of travel) by amt."""
    mx,my=(a[0]+b[0])/2,(a[1]+b[1])/2; dx,dy=b[0]-a[0],b[1]-a[1]; L=(dx*dx+dy*dy)**.5
    return (mx+dy/L*amt, my-dx/L*amt)
def crown4(x):
    (dmy,dmr,dsx,dsy,dsr, tx,ty,vx,vy,my, sx,sy, bx,byb, rt,rv,rm,rs,rb, b1,b2,rbul)=x
    LT=(12-tx,ty); LV=(12-vx,vy); MT=(12,my); RV=(12+vx,vy); RT=(12+tx,ty)
    RS=(12+sx,sy); RB=(12+bx,byb); LB=(12-bx,byb); LS=(12-sx,sy)
    # clockwise in screen space: tips -> right side -> bottom -> left side
    P=[LT,_bulge(LT,LV,-b1),LV,_bulge(LV,MT,-b2),MT,_bulge(MT,RV,-b2),RV,_bulge(RV,RT,-b1),RT,RS,RB,LB,LS]
    Rr=[rt,rbul,rv,rbul,rm,rbul,rv,rbul,rt,rs,rb,rb,rs]
    return [("F",circle(12,dmy,dmr),"C"),("F",circle(12-dsx,dsy,dsr),"C"),("F",circle(12+dsx,dsy,dsr),"C"),
            ("F",rpoly(P,Rr),"C")]
