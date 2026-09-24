import os as _os
HERE=_os.path.dirname(_os.path.abspath(__file__))
"""App glyphs that have no counterpart in the reference sheet, drawn to the
rules measured from it (see RULES)."""
import sys, math, json; sys.path.insert(0,HERE)
from lib import *
from g_profile import _bulge
from g_ref import star_pts, rot

LW=2.05   # cut lines inside a body   (fits: chart 1.9, list 2.13, shield 2.07)
HW=2.1    # handles, shackles, straws (fits: bag 1.89, lock 2.24)
SW=3.2    # standalone line glyphs: x, +, check, chevron, menu
AW=4.0    # standalone arrow stems    (reference sort arrows: 4.04-4.15)
N=3.2     # superellipse exponent     (reference squircles: 3.05-3.20)
BR,BG=4.74,1.91   # badge radius and its ring of background (list+ fit)

def C_(d): return ("F",d,"C")
def D_(d): return ("F",d,"D")
def SC(d,w): return ("S",d,w,"C")
def SD(d,w): return ("S",d,w,"D")
def sq(cx=12,cy=12,w=20.8,h=20.8,n=N): return squircle(cx,cy,w,h,n)

def badge(bx,by,inner):
    els=[D_(circle(bx,by,BR+BG)),C_(circle(bx,by,BR))]
    a=1.72; w=1.9
    if inner=="plus": els+=[SD(line((bx-a,by),(bx+a,by)),w),SD(line((bx,by-a),(bx,by+a)),w)]
    elif inner=="check": els+=[SD(line((bx-1.8,by+0.1),(bx-0.5,by+1.4),(bx+1.9,by-1.2)),w)]
    elif inner=="slash": els+=[SD(line((bx-1.45,by+1.45),(bx+1.45,by-1.45)),w)]
    elif inner=="alert": els+=[SD(line((bx,by-2.0),(bx,by+0.2)),1.6),D_(circle(bx,by+2.0,0.85))]
    return els

# ---------------------------------------------------------------- tabs --
def home():
    P=[(12,1.8),(22.3,10.0),(22.3,22.2),(1.7,22.2),(1.7,10.0)]
    Q=[P[0],P[1],_bulge(P[1],P[2],-0.35),P[2],_bulge(P[2],P[3],-0.3),P[3],_bulge(P[3],P[4],-0.35),P[4]]
    return [C_(rpoly(Q,[2.6,2.4,9,4.8,9,4.8,9,2.4])), D_(rrect(9.9,13.6,4.2,5.4,2.1))]

def member():
    return [C_(sq(12,12,20.8,16.8)), D_(rrect(0,7.2,24,2.4,0)), SD(line((5.6,14.8),(10.4,14.8)),LW),
            SD(line((14.6,14.8),(18.4,14.8)),LW)]

# --------------------------------------------------------------- chrome --
def cart():
    return [SC("M1.8 2.6H3.4L6.1 15.4H19.6",HW),
            C_(rpoly([(4.6,4.4),(22.3,4.4),(20.6,13.4),(6.4,13.4)],[1.0,2.0,2.4,1.6])),
            SD(line((9.2,8.9),(18.0,8.9)),LW),
            C_(circle(8.3,20.2,2.1)),C_(circle(18.3,20.2,2.1))]
def menu():
    return [SC(line((3.4,5.6),(20.6,5.6)),SW),SC(line((3.4,12),(20.6,12)),SW),SC(line((3.4,18.4),(20.6,18.4)),SW)]
def more():
    return [C_(circle(4.4,12,2.4)),C_(circle(12,12,2.4)),C_(circle(19.6,12,2.4))]
def search():
    return [SC(circle(10.4,10.4,7.2),3.0), SC(line((16.2,16.2),(20.8,20.8)),AW)]
def bookmark():
    P=[(3.9,1.7),(20.1,1.7),(20.1,22.1),(12,17.2),(3.9,22.1)]
    return [C_(rpoly(P,[4.2,4.2,1.5,2.0,1.5]))]
def bell():
    P=[(12,1.7),(18.3,5.2),(18.8,11.6),(21.9,17.4),(2.1,17.4),(5.2,11.6),(5.7,5.2)]
    return [C_(rpoly(P,[6.2,3.6,3.2,1.6,1.6,3.2,3.6])), C_(rrect(8.6,19.2,6.8,3.1,1.55))]
def bell_off():
    return bell()+[SD(line((2.6,2.6),(21.4,21.4)),HW+2*1.6), SC(line((3.0,3.0),(21.0,21.0)),HW)]
def gift():
    return [C_(circle(8.9,4.6,2.6)),C_(circle(15.1,4.6,2.6)),
            C_(rrect(1.8,6.6,20.4,5.0,2.4)),
            C_(rpoly([(3.4,13.2),(20.6,13.2),(20.6,22.3),(3.4,22.3)],[0.9,0.9,3.8,3.8])),
            SD(line((12,1.0),(12,23.0)),LW)]
def close():
    return [SC(line((4.9,4.9),(19.1,19.1)),SW),SC(line((19.1,4.9),(4.9,19.1)),SW)]
def chevron():
    return [SC(line((8.8,4.2),(16.4,12),(8.8,19.8)),SW)]
def pin():
    return [C_(circle(12,9.6,8.4)), C_(rpoly([(4.6,13.4),(19.4,13.4),(12,22.6)],[0,0,1.8])), D_(circle(12,9.6,3.0))]
def stack():
    top=[(12,1.8),(22.3,7.4),(12,13.0),(1.7,7.4)]
    def band(dy): return [(1.7,11.9+dy),(3.9,10.7+dy),(12,15.1+dy),(20.1,10.7+dy),(22.3,11.9+dy),(12,17.5+dy)]
    return [C_(rpoly(top,[1.8,1.8,1.8,1.8])),C_(rpoly(band(0),[1.1,0.6,0.6,0.6,1.1,1.6])),C_(rpoly(band(4.6),[1.1,0.6,0.6,0.6,1.1,1.6]))]
def photo():
    return [C_(sq()), D_(circle(8.2,8.0,2.1)),
            D_(rpoly([(4.8,17.6),(9.6,12.0),(12.8,15.4),(15.2,13.0),(19.4,17.6)],[1.0,1.0,0.8,1.0,1.0]))]
def verified():
    P=[]
    for k in range(16):
        a=math.radians(-90+k*22.5); r=10.9 if k%2==0 else 9.4
        P.append((12+r*math.cos(a),12+r*math.sin(a)))
    return [C_(rpoly(P,[1.7 if k%2==0 else 1.2 for k in range(16)])), SD(line((7.7,12.3),(10.7,15.2),(16.4,9.3)),LW)]
def plus():
    return [SC(line((12,4.2),(12,19.8)),SW),SC(line((4.2,12),(19.8,12)),SW)]
def minus():
    return [SC(line((4.2,12),(19.8,12)),SW)]
def check():
    return [SC(line((4.4,12.6),(9.4,17.4),(19.6,6.8)),SW)]
def folder():
    P=[(1.7,3.4),(8.8,3.4),(11.2,6.0),(22.3,6.0),(22.3,20.6),(1.7,20.6)]
    return [C_(rpoly(P,[2.8,1.2,1.0,3.2,4.2,4.2])), D_(rrect(0,9.0,24,2.1,0))]
def person(cx=12,hy=6.9,hr=4.3,bx0=2.6,bx1=21.4,by0=13.3,by1=21.9):
    return [C_(circle(cx,hy,hr)), C_(rrect(bx0,by0,bx1-bx0,by1-by0,(by1-by0)/2))]
def users():
    back=[C_(circle(17.0,7.4,3.4)),C_(rrect(12.6,13.4,9.7,7.6,3.8))]
    ring=[D_(circle(9.2,7.0,4.1+1.5)),D_(rrect(1.7-1.5,12.9-1.5,14.8+3.0,9.0+3.0,6.0))]
    front=[C_(circle(9.2,7.0,4.1)),C_(rrect(1.7,12.9,14.8,9.0,4.5))]
    return back+ring+front
def user_badge(kind):
    return person(10.3,6.9,4.3,1.7,18.9,13.3,21.9)+badge(17.9,17.9,kind)
def pos():
    return [C_(sq(12,12,17.0,20.8)), D_(rrect(6.9,4.4,10.2,5.2,1.6)),
            *[D_(rrect(x-1.1,y-1.1,2.2,2.2,0.6)) for y in (13.4,17.4) for x in (8.2,12,15.8)]]
def at_sign():
    return [C_(circle(12,12,11)), SD(circle(11.4,12,3.2),LW),
            SD("M14.6 8.8V13.4a2.1 2.1 0 0 0 4.2 0V12a6.9 6.9 0 1 0-2.9 5.6",LW)]
def scooter():
    return [C_(circle(5.2,18.4,3.4)),D_(circle(5.2,18.4,1.2)),C_(circle(18.8,18.4,3.4)),D_(circle(18.8,18.4,1.2)),
            C_(rpoly([(2.0,9.6),(9.8,9.6),(12.6,15.6),(2.4,15.6)],[1.6,1.8,1.2,1.6])),
            SC(line((12.6,15.6),(16.8,15.6),(18.6,4.2),(21.4,4.2)),HW)]
def bike():
    return [SC(circle(6.0,16.2,3.8),HW),SC(circle(18.0,16.2,3.8),HW),
            SC(line((6.0,16.2),(9.8,8.8),(14.8,8.8),(18.0,16.2)),HW),SC(line((9.8,8.8),(12.2,16.2),(6.0,16.2)),HW),
            SC(line((8.4,5.4),(11.0,5.4)),HW),SC(line((14.8,8.8),(13.9,4.9),(16.2,4.9)),HW)]
def store():
    return [C_(rrect(1.7,2.0,20.6,7.4,2.6)), SD(line((8.8,1.0),(8.8,10.0)),LW), SD(line((15.2,1.0),(15.2,10.0)),LW),
            C_(rpoly([(3.2,11.0),(20.8,11.0),(20.8,22.3),(3.2,22.3)],[0.9,0.9,3.8,3.8])),
            D_(rrect(9.6,15.0,4.8,5.2,1.8))]
def building():
    return [C_(sq(12,12,16.6,20.8)), *[D_(rrect(x-1.2,y-1.2,2.4,2.4,0.7)) for y in (6.4,10.8) for x in (9.0,15.0)],
            D_(rrect(9.8,15.4,4.4,4.8,1.6))]
def clock():
    return [C_(circle(12,12,11)), SD(line((12,6.4),(12,12.2),(15.6,14.4)),LW)]
def coffee():
    return [SC("M17.2 9.4H18.4a3.2 3.2 0 0 1 0 6.4H17.4",HW),
            C_(rpoly([(2.4,5.6),(18.0,5.6),(16.6,20.6),(3.8,20.6)],[1.6,1.6,3.8,3.8])),
            SD(line((1.0,10.2),(19.0,10.2)),LW)]
def chef_hat():
    return [C_(circle(7.2,8.2,4.6)),C_(circle(12,6.0,4.8)),C_(circle(16.8,8.2,4.6)),C_(rrect(4.8,8.2,14.4,8.4,1.4)),
            C_(rrect(4.8,18.0,14.4,4.3,1.6))]
def coins():
    return [C_(circle(9.2,9.2,7.4)), D_(circle(14.8,14.8,7.4+1.6)), C_(circle(14.8,14.8,7.4)), SD(circle(14.8,14.8,3.4),LW)]
def hand_coins():
    return [C_(circle(14.4,6.6,5.0)), SD(circle(14.4,6.6,2.1),LW),
            C_(rrect(1.7,13.4,3.8,8.9,1.5)),
            C_(rpoly([(7.0,14.2),(11.8,14.2),(13.4,16.6),(19.2,15.0),(22.3,16.6),(16.4,22.3),(7.0,22.3)],[1.2,1.4,1.0,1.6,1.6,2.6,1.0]))]
def copy():
    return [C_(sq(8.6,8.6,13.8,13.8)), D_(sq(15.4,15.4,13.8+3.2,13.8+3.2)), C_(sq(15.4,15.4,13.8,13.8))]
def share():
    return [SC(line((5.6,12),(18.2,5.4)),HW),SC(line((5.6,12),(18.2,18.6)),HW),
            C_(circle(18.2,5.4,3.6)),C_(circle(18.2,18.6,3.6)),C_(circle(5.6,12,3.6))]
def check_circle():
    return [C_(circle(12,12,11)), SD(line((7.4,12.3),(10.5,15.3),(16.6,9.1)),LW+0.1)]
def close_circle():
    return [C_(circle(12,12,11)), SD(line((8.4,8.4),(15.6,15.6)),LW+0.1), SD(line((15.6,8.4),(8.4,15.6)),LW+0.1)]
def alert_circle():
    return [C_(circle(12,12,11)), SD(line((12,6.6),(12,12.8)),LW+0.1), D_(circle(12,16.8,1.2))]
def alert_triangle():
    return [C_(rpoly([(12,0.6),(24.0,21.6),(0.0,21.6)],[2.2,2.2,2.2])), SD(line((12,8.6),(12,14.0)),LW+0.1), D_(circle(12,17.9,1.25))]
def qr():
    def finder(x,y):
        return [C_(rrect(x,y,8.8,8.8,2.8)),D_(rrect(x+1.9,y+1.9,5.0,5.0,1.4)),C_(rrect(x+3.4,y+3.4,2.0,2.0,0.6))]
    return finder(1.6,1.6)+finder(13.6,1.6)+finder(1.6,13.6)+[
        C_(rrect(13.6,13.6,3.6,3.6,1.1)),C_(rrect(18.8,13.6,3.6,3.6,1.1)),C_(rrect(13.6,18.8,3.6,3.6,1.1)),C_(rrect(18.8,18.8,3.6,3.6,1.1))]
def receipt():
    P=[(3.4,1.7),(20.6,1.7),(20.6,22.3),(17.7,20.4),(14.9,22.3),(12,20.4),(9.1,22.3),(6.3,20.4),(3.4,22.3)]
    return [C_(rpoly(P,[3.4,3.4,0.8,0.8,0.8,0.8,0.8,0.8,0.8])), SD(line((7.6,7.2),(16.4,7.2)),LW), SD(line((7.6,11.6),(13.0,11.6)),LW)]
def ticket_body():
    return [C_(sq(12,12,20.8,15.6)), D_(circle(1.2,12,2.6)), D_(circle(22.8,12,2.6))]
def ticket():
    return ticket_body()+[SD(line((15.6,7.6),(15.6,8.2)),LW),SD(line((15.6,11.7),(15.6,12.3)),LW),SD(line((15.6,15.8),(15.6,16.4)),LW)]
def ticket_percent():
    return ticket_body()+[D_(circle(9.0,9.4,1.4)),D_(circle(15.0,14.6,1.4)),SD(line((15.2,8.6),(8.8,15.4)),LW)]
def ticket_check():
    return ticket_body()+[SD(line((8.2,12.2),(10.9,14.8),(15.8,9.6)),LW)]
def arrow_head(tip, direction_deg, size=7.4, r=1.2):
    a=math.radians(direction_deg)
    back=(tip[0]-size*0.86*math.cos(a), tip[1]-size*0.86*math.sin(a))
    n=(-math.sin(a),math.cos(a))
    P=[tip,(back[0]+n[0]*size*0.55,back[1]+n[1]*size*0.55),(back[0]-n[0]*size*0.55,back[1]-n[1]*size*0.55)]
    return C_(rpoly(P,[r,r,r]))
def trend_up():
    return [SC(line((2.2,18.0),(8.6,11.6),(12.4,15.4),(18.4,9.4)),3.0), arrow_head((21.8,5.6),-45,8.0)]
def trend_down():
    return [SC(line((2.2,6.0),(8.6,12.4),(12.4,8.6),(18.4,14.6)),3.0), arrow_head((21.8,18.4),45,8.0)]
def refresh():
    return [SC("M18.6 7.4A8 8 0 0 0 4.4 9.6",3.0), arrow_head((20.6,4.2),-70,7.0),
            SC("M5.4 16.6A8 8 0 0 0 19.6 14.4",3.0), arrow_head((3.4,19.8),110,7.0)]
def sliders():
    return [SC(line((2.4,6.6),(21.6,6.6)),2.4), SC(line((2.4,17.4),(21.6,17.4)),2.4),
            D_(circle(8.4,6.6,3.6+1.5)),C_(circle(8.4,6.6,3.6)), D_(circle(15.6,17.4,3.6+1.5)),C_(circle(15.6,17.4,3.6))]
def sparkle(cx,cy,r,ri):
    P=[]
    for k in range(8):
        a=math.radians(-90+k*45); rr=r if k%2==0 else ri
        P.append((cx+rr*math.cos(a),cy+rr*math.sin(a)))
    return C_(rpoly(P,[0.9 if k%2==0 else 1.4 for k in range(8)]))
def sparkles():
    return [sparkle(9.2,9.6,9.2,2.9), sparkle(18.4,18.0,5.4,2.1)]
def star():
    return [C_(rpoly(star_pts(12,13.0,13.6,6.3),[1.9,1.0]*5))]
def ban():
    return [C_(circle(12,12,11)), D_(circle(12,12,7.4)), SC(line((6.8,6.8),(17.2,17.2)),3.6)]
def settings():
    P=[]
    for k in range(8):
        base=math.radians(k*45)
        for da,r in ((-13,11.0),(13,11.0),(22.5-1,8.6),(22.5+1,8.6)):
            a=base+math.radians(da); P.append((12+r*math.cos(a),12+r*math.sin(a)))
    return [C_(rpoly(P,[1.2,1.2,0.8,0.8]*8)), D_(circle(12,12,3.4))]
def eye():
    return [C_(rpoly([(0.8,12),(12,3.6),(23.2,12),(12,20.4)],[1.8,9,1.8,9])), D_(circle(12,12,4.4)), C_(circle(12,12,2.0))]
def globe():
    return [C_(circle(12,12,11)), SD(squircle(12,12,8.4,20.6,2),LW), SD(line((1.0,12),(23.0,12)),LW)]
def image_plus():
    return [C_(sq(10.6,10.6,19.2,19.2)), D_(circle(7.4,7.2,1.9)),
            D_(rpoly([(3.8,15.4),(8.2,10.6),(11.2,13.6),(12.8,12.2),(16.0,15.4)],[0.9,0.9,0.7,0.9,0.9])),
            *badge(17.9,17.9,"plus")]
def images():
    return [C_(sq(9.4,9.4,15.6,15.6)), D_(sq(14.6,14.6,15.6+3.2,15.6+3.2)), C_(sq(14.6,14.6,15.6,15.6)),
            D_(circle(11.4,11.0,1.7)), D_(rpoly([(9.2,19.0),(12.8,15.0),(15.2,17.4),(16.8,16.0),(19.8,19.0)],[0.8,0.8,0.6,0.8,0.8]))]
def hourglass():
    return [C_(rrect(3.4,1.7,17.2,3.0,1.5)), C_(rrect(3.4,19.3,17.2,3.0,1.5)),
            C_(rpoly([(5.4,6.0),(18.6,6.0),(13.0,12.0),(18.6,18.0),(5.4,18.0),(11.0,12.0)],[1.4,1.4,1.6,1.4,1.4,1.6]))]
def pause():
    return [C_(rrect(4.4,1.8,5.8,20.4,2.9)), C_(rrect(13.8,1.8,5.8,20.4,2.9))]
def infinity():
    return [SC("M12 12C9.6 8.2 3.2 7.6 3.2 12S9.6 15.8 12 12 20.8 7.6 20.8 12 14.4 15.8 12 12Z",3.2)]
def monitor():
    return [C_(sq(12,9.4,20.8,15.4)), SC(line((12,17.4),(12,20.2)),HW), C_(rrect(7.2,19.6,9.6,2.6,1.3))]
def phone():
    return [SC("M6.4 3.6C4.4 3.6 3.2 5.0 3.6 7.0C4.9 14.0 10.0 19.1 17.0 20.4C19.0 20.8 20.4 19.6 20.4 17.6",4.4),
            C_(rrect(2.4,2.2,5.6,5.8,2.6)), C_(rrect(16.0,16.0,5.8,5.6,2.6))]
def hash_():
    return [SC(line((9.4,3.0),(7.6,21.0)),2.8),SC(line((16.4,3.0),(14.6,21.0)),2.8),
            SC(line((3.6,8.6),(20.8,8.6)),2.8),SC(line((3.2,15.4),(20.4,15.4)),2.8)]
def armchair():
    return [C_(sq(12,8.4,15.0,13.2)), C_(rrect(4.8,13.2,14.4,6.2,1.4)),
            D_(rrect(0.2,8.0,7.6,12.6,3.8)),D_(rrect(16.2,8.0,7.6,12.6,3.8)),
            C_(rrect(1.7,9.5,4.6,9.6,2.3)),C_(rrect(17.7,9.5,4.6,9.6,2.3)),
            C_(rrect(4.4,19.0,2.4,3.3,1.2)),C_(rrect(17.2,19.0,2.4,3.3,1.2))]
def footprints():
    return [C_(squircle(7.0,7.6,6.4,10.6,2.0)),C_(squircle(7.0,17.6,4.8,4.6,2.0)),
            C_(squircle(17.0,11.6,6.4,10.6,2.0)),C_(squircle(17.0,21.4 - 0.2,4.8,4.6,2.0))]
def cold_cup():
    return [SC(line((13.2,6.6),(15.0,2.0),(18.4,2.0)),HW),
            C_(rrect(2.8,6.6,18.4,3.2,1.6)),
            C_(rpoly([(4.4,11.2),(19.6,11.2),(17.8,22.3),(6.2,22.3)],[0.8,0.8,3.2,3.2]))]
def drumstick():
    return [C_(circle(14.4,9.6,8.0)), SC(line((9.0,15.0),(5.0,19.0)),3.0),
            C_(circle(3.2,18.4,2.1)),C_(circle(5.6,20.8,2.1))]
def cake():
    return [C_(circle(12,1.9,1.3)), C_(rrect(10.9,4.2,2.2,3.6,1.1)),
            C_(rrect(3.2,8.8,17.6,6.0,2.6)), C_(rrect(1.7,16.2,20.6,6.1,2.8))]
def soup():
    return [SC(line((8.0,2.6),(8.0,6.2)),LW),SC(line((12,1.8),(12,6.2)),LW),SC(line((16.0,2.6),(16.0,6.2)),LW),
            C_(rpoly([(1.7,9.6),(22.3,9.6),(18.2,21.8),(5.8,21.8)],[1.4,1.4,5.2,5.2]))]
def cookie():
    return [C_(circle(12,12,11)), D_(circle(20.8,4.4,3.8)),
            D_(circle(8.0,8.6,1.4)),D_(circle(14.0,11.4,1.3)),D_(circle(8.8,15.4,1.3)),D_(circle(15.6,17.0,1.4))]
def tag():
    P=[(1.7,12),(7.8,4.0),(22.3,4.0),(22.3,20.0),(7.8,20.0)]
    return [C_(rpoly(P,[1.9,1.6,3.8,3.8,1.6])), D_(circle(8.8,12,1.8))]
def grid():
    return [C_(sq(x,y,9.0,9.0)) for y in (6.5,17.5) for x in (6.5,17.5)]
def logout():
    body=[C_(sq(8.0,12,12.6,20.6))]
    stem=line((9.0,12),(17.0,12)); head=[(16.0,5.8),(22.6,12),(16.0,18.2)]
    return body+[SD(stem,AW+3.2), D_(rpoly(head,[2.6,2.6,2.6])), SC(stem,AW*0.85), C_(rpoly([(16.6,7.6),(21.2,12),(16.6,16.4)],[1.2,1.2,1.2]))]
def whatsapp():
    return [C_(circle(12.6,11.4,10.2)), C_(rpoly([(4.6,17.0),(1.4,22.6),(8.2,20.6)],[0.2,1.2,0.2])),
            SD("M8.8 7.2C8.0 7.2 7.4 7.8 7.6 8.8C8.4 12.2 11.0 14.8 14.4 15.6C15.4 15.8 16.0 15.2 16.0 14.4",2.6)]
def dimsum():
    return [C_(rrect(10.4,1.6,3.2,2.8,1.4)), C_("M2.4 10.4C2.4 6.2 6.8 3.6 12 3.6S21.6 6.2 21.6 10.4Z"),
            C_(rpoly([(1.7,12.0),(22.3,12.0),(22.3,22.3),(1.7,22.3)],[1.0,1.0,4.0,4.0])), D_(rrect(0,15.6,24,2.1,0))]
def bowl():
    return [SC(line((12.8,9.6),(19.6,1.8)),HW),SC(line((16.0,9.6),(22.0,3.2)),HW),
            C_("M3.8 11.2C3.8 7.8 7.4 5.6 12 5.6S20.2 7.8 20.2 11.2Z"),
            C_("M1.7 12.6H22.3A10.3 9.7 0 0 1 1.7 12.6Z")]
def shirt():
    P=[(7.6,1.8),(9.6,1.8),(12,3.8),(14.4,1.8),(16.4,1.8),(22.6,6.2),(20.0,11.4),(18.0,10.4),(18.0,22.3),(6.0,22.3),(6.0,10.4),(4.0,11.4),(1.4,6.2)]
    return [C_(rpoly(P,[1.4,1.0,1.8,1.0,1.4,1.8,1.4,0.6,3.0,3.0,0.6,1.4,1.8]))]
def points_card():
    return [C_(sq(12,12,20.8,16.8)), SD(line((5.4,9.4),(5.4,14.6)),LW+0.6), D_(circle(15.2,12,4.2)), C_(circle(15.2,12,2.0))]

APP={
 "home":home,"member":member,"cart":cart,"menu":menu,"more":more,"search":search,"bookmark":bookmark,"bell":bell,
 "bellOff":bell_off,"gift":gift,"close":close,"chevronRight":chevron,"pin":pin,"stack":stack,"photoPost":photo,
 "verified":verified,"plus":plus,"minus":minus,"check":check,"folder":folder,"users":users,
 "userOff":lambda:user_badge("slash"),"userPlus":lambda:user_badge("plus"),"userCheck":lambda:user_badge("check"),
 "pos":pos,"atSign":at_sign,"scooter":scooter,"bike":bike,"store":store,"building":building,"clock":clock,
 "coffee":coffee,"chefHat":chef_hat,"coins":coins,"handCoins":hand_coins,"copy":copy,"share":share,
 "checkCircle":check_circle,"closeCircle":close_circle,"alertCircle":alert_circle,"alertTriangle":alert_triangle,
 "qr":qr,"receipt":receipt,"ticket":ticket,"ticketPercent":ticket_percent,"ticketCheck":ticket_check,
 "trendUp":trend_up,"trendDown":trend_down,"refresh":refresh,"sliders":sliders,"sparkles":sparkles,"star":star,
 "ban":ban,"settings":settings,"eye":eye,"globe":globe,"imagePlus":image_plus,"images":images,"hourglass":hourglass,
 "pause":pause,"infinity":infinity,"monitor":monitor,"phone":phone,"hash":hash_,"armchair":armchair,
 "footprints":footprints,"coldCup":cold_cup,"drumstick":drumstick,"cake":cake,"soup":soup,"cookie":cookie,
 "tag":tag,"grid":grid,"logout":logout,"whatsapp":whatsapp,"dimsum":dimsum,"bowl":bowl,"shirt":shirt,"pointsCard":points_card,
}

# ------------------------------------------------------------ round 2 --
def bike2():
    els=[SC(line((5.6,16.6),(9.8,9.0),(14.8,9.0),(18.4,16.6)),HW),SC(line((9.8,9.0),(12.4,16.6),(5.6,16.6)),HW),
         SC(line((8.0,5.6),(11.0,5.6)),HW),SC(line((14.8,9.0),(13.9,5.2),(16.4,5.2)),HW)]
    for cx in (5.6,18.4):
        els+=[D_(circle(cx,16.6,4.4+1.4)),C_(circle(cx,16.6,4.4)),D_(circle(cx,16.6,1.7))]
    return els
def store2():
    els=[C_(rrect(1.7,1.8,20.6,6.4,2.4))]
    for k in range(6): els.append(C_(circle(1.7+1.717+k*3.433,8.2,1.717)))
    els+=[C_(rpoly([(3.2,11.4),(20.8,11.4),(20.8,22.3),(3.2,22.3)],[0.9,0.9,3.8,3.8])), D_(rrect(9.6,15.2,4.8,5.0,1.8))]
    return els
def building2():
    els=[C_(sq(12,12,16.8,20.8))]
    for y in (5.2,9.2,13.2):
        for x in (9.2,14.8): els.append(D_(rrect(x-1.3,y-1.2,2.6,2.4,0.7)))
    els.append(D_(rrect(10.0,17.2,4.0,6.0,1.6)))
    return els
def coins2():
    return [C_(circle(9.2,9.2,7.2)), D_(circle(14.8,14.8,7.2+1.6)), C_(circle(14.8,14.8,7.2)),
            D_(rpoly(star_pts(14.8,15.2,3.5,1.55),[0.35,0.2]*5))]
def hand_coins2():
    return [C_(circle(12,6.9,5.4)), D_(rpoly(star_pts(12,7.2,2.7,1.2),[0.3,0.15]*5)),
            C_(rrect(1.7,14.6,20.6,6.8,3.4)), SD(line((6.0,18.0),(12.4,18.0)),LW)]
def gift2():
    return [C_(circle(9.3,4.3,2.5)),D_(circle(9.3,4.3,0.95)),C_(circle(14.7,4.3,2.5)),D_(circle(14.7,4.3,0.95)),
            C_(rrect(1.8,6.8,20.4,4.8,2.4)),
            C_(rpoly([(3.4,13.2),(20.6,13.2),(20.6,22.3),(3.4,22.3)],[0.9,0.9,3.8,3.8])),
            SD(line((12,6.0),(12,23.0)),LW)]
def refresh2():
    import math
    c=(12,12); r=7.6; els=[]
    for a0,a1 in ((200,320),(20,140)):
        p0=(c[0]+r*math.cos(math.radians(a0)),c[1]+r*math.sin(math.radians(a0)))
        p1=(c[0]+r*math.cos(math.radians(a1)),c[1]+r*math.sin(math.radians(a1)))
        els.append(SC(f"M{f(p0[0])} {f(p0[1])}A{f(r)} {f(r)} 0 0 1 {f(p1[0])} {f(p1[1])}",3.0))
        t=math.radians(a1); tg=(-math.sin(t),math.cos(t))
        tip=(p1[0]+tg[0]*3.4,p1[1]+tg[1]*3.4)
        els.append(arrow_head(tip, math.degrees(math.atan2(tg[1],tg[0])), 7.2, 1.1))
    return els
def monitor2():
    return [C_(sq(12,9.0,20.8,14.8)), C_(rrect(10.3,15.0,3.4,5.0,0.6)), C_(rrect(6.4,19.3,11.2,3.0,1.5))]
def armchair2():
    return [C_(sq(12,7.9,11.6,11.8)), C_(rrect(6.2,14.9,11.6,4.8,1.4)),
            C_(rrect(1.7,9.2,3.4,13.1,1.7)), C_(rrect(18.9,9.2,3.4,13.1,1.7))]
def points_card2():
    return [C_(sq(12,12,20.8,16.8)), SD(line((5.4,9.8),(9.4,9.8)),LW), SD(line((5.4,14.2),(7.8,14.2)),LW),
            D_(circle(15.6,12,4.6)), C_(circle(15.6,12,3.0))]
APP.update({"bike":bike2,"store":store2,"building":building2,"coins":coins2,"handCoins":hand_coins2,"gift":gift2,
            "refresh":refresh2,"monitor":monitor2,"armchair":armchair2,"pointsCard":points_card2})

def delivery():
    """Delivery scooter with a box on the back — the one mark for 'Delivery',
    which the app drew as a bicycle in one place and a scooter in another."""
    els=[C_(sq(6.0,7.2,8.2,7.0)),
         C_(rpoly([(1.7,12.0),(11.4,12.0),(14.0,16.8),(2.2,16.8)],[1.4,1.8,1.2,1.4])),
         SC(line((13.2,16.4),(17.0,16.4)),HW), SC(line((17.2,16.0),(18.8,5.0),(21.6,5.0)),HW)]
    for cx in (5.4,18.8):
        els+=[D_(circle(cx,18.9,3.4+1.3)),C_(circle(cx,18.9,3.4)),D_(circle(cx,18.9,1.2))]
    return els
def hand_coins3():
    return [C_(circle(12,6.4,5.4)), D_(rpoly(star_pts(12,6.7,2.7,1.2),[0.3,0.15]*5)),
            C_("M1.7 13.6H22.3A10.3 8.7 0 0 1 1.7 13.6Z"), SD(line((12,12.6),(12,17.2)),LW)]
APP.update({"bike":delivery,"scooter":delivery,"handCoins":hand_coins3})

def hand_coins4():
    return [C_(circle(12,6.6,5.4)), D_(rpoly(star_pts(12,6.9,2.7,1.2),[0.3,0.15]*5)),
            C_("M1.7 14.2H22.3A10.3 8.1 0 0 1 1.7 14.2Z"), D_(circle(12,14.2,1.5))]
def monitor3():
    return [C_(sq(12,9.2,20.8,14.4)), D_(rrect(0,12.6,24,1.8,0)), C_(rrect(10.4,15.6,3.2,4.2,0.6)), C_(rrect(6.0,19.3,12.0,3.0,1.5))]
APP.update({"handCoins":hand_coins4,"monitor":monitor3})

# Rims that meet a curve at ~90 degrees get a real radius, not the 0.4 floor.
def _rim(y, x0, x1, ry, r=1.3):
    rx=(x1-x0)/2
    return (f"M{f(x0+r)} {f(y)}H{f(x1-r)}a{f(r)} {f(r)} 0 0 1 {f(r)} {f(r)}"
            f"A{f(rx)} {f(ry)} 0 0 1 {f(x0)} {f(y+r)}a{f(r)} {f(r)} 0 0 1 {f(r)} {f(-r)}Z")
def hand_coins5():
    return [C_(circle(12,6.6,5.4)), D_(rpoly(star_pts(12,6.9,2.7,1.2),[0.3,0.15]*5)),
            C_(_rim(14.2,1.7,22.3,6.9)), D_(circle(12,14.2,1.5))]
def bowl2():
    return [SC(line((12.8,9.6),(19.6,1.8)),HW),SC(line((16.0,9.6),(22.0,3.2)),HW),
            C_("M3.8 11.2C3.8 7.8 7.4 5.6 12 5.6S20.2 7.8 20.2 11.2Z"),
            C_(_rim(12.6,1.7,22.3,8.4))]
def dimsum2():
    lid=rpoly([(2.4,10.4),(4.2,6.0),(12,3.6),(19.8,6.0),(21.6,10.4)],[1.3,8,8,8,1.3])
    return [C_(rrect(10.4,1.6,3.2,2.8,1.4)), C_(lid),
            C_(rpoly([(1.7,12.0),(22.3,12.0),(22.3,22.3),(1.7,22.3)],[1.0,1.0,4.0,4.0])), D_(rrect(0,15.6,24,2.1,0))]
APP.update({"handCoins":hand_coins5,"bowl":bowl2,"dimsum":dimsum2})

def dumpling():
    """Dimsum as a dumpling on a plate. The steamer basket read as a burger
    next to the cake — both were stacks of pills."""
    body=rpoly([(1.9,17.4),(3.8,10.4),(12,4.0),(20.2,10.4),(22.1,17.4)],[2.2,6,4.2,6,2.2])
    return [C_(body), SD(line((8.2,12.2),(10.8,7.6)),LW), SD(line((12,13.0),(12,7.4)),LW), SD(line((15.8,12.2),(13.2,7.6)),LW),
            C_(rrect(3.6,19.2,16.8,3.1,1.55))]
def cake2():
    return [C_(circle(12,1.6,1.25)), C_(rrect(10.9,4.0,2.2,4.0,1.1)),
            C_(rpoly([(2.4,9.2),(21.6,9.2),(21.6,22.3),(2.4,22.3)],[3.0,3.0,3.6,3.6])),
            SD("M1.2 14.2C3.4 16.6 5.6 16.6 7.6 14.4S11.2 12.2 13.2 14.4 17.6 16.6 22.8 13.6",LW)]
APP.update({"dimsum":dumpling,"cake":cake2})

def bao():
    return [C_(circle(12,3.3,2.0)), C_(squircle(12,13.0,20.6,15.2,2.6)),
            SD(line((10.6,7.0),(7.0,11.8)),LW), SD(line((12,7.4),(12,12.8)),LW), SD(line((13.4,7.0),(17.0,11.8)),LW)]
APP.update({"dimsum":bao})

# ------------------------------------------------------------ round 3 --
# Redrawn for tidiness: symmetric, constant-width strokes, curved sides.
def bell3():
    body=("M12 1.9C15.9 1.9 18.2 4.9 18.2 8.6V11.2C18.2 13.1 19.3 14.7 20.8 16.1"
          "C21.9 17.1 21.3 18.6 19.8 18.6H4.2C2.7 18.6 2.1 17.1 3.2 16.1"
          "C4.7 14.7 5.8 13.1 5.8 11.2V8.6C5.8 4.9 8.1 1.9 12 1.9Z")
    return [C_(body), C_(rrect(8.8,20.0,6.4,2.8,1.4))]
def bell_off3():
    return bell3()+[SD(line((4.0,3.0),(20.2,21.2)),2.1+2*1.3), SC(line((4.0,3.0),(20.2,21.2)),2.1)]
def cart3():
    return [SC("M1.9 2.9H3.3L5.8 16.2H19.4",HW),
            C_(rpoly([(3.77,5.4),(22.2,5.4),(20.6,13.6),(5.31,13.6)],[0.8,1.8,2.2,0.8])),
            SD(line((9.4,9.5),(17.4,9.5)),LW),
            C_(circle(8.2,20.3,2.05)),C_(circle(17.6,20.3,2.05))]
def help3():
    import math
    cx,cy,r=12,9.4,3.05
    p0=(cx+r*math.cos(math.radians(200)),cy+r*math.sin(math.radians(200)))
    p1=(cx+r*math.cos(math.radians(45)),cy+r*math.sin(math.radians(45)))
    d=(f"M{f(p0[0])} {f(p0[1])}A{r} {r} 0 1 1 {f(p1[0])} {f(p1[1])}"
       f"C{f(p1[0]-0.75)} {f(p1[1]+0.75)} 12 {f(12.7)} 12 13.7V14.1")
    return [C_(circle(12,12,11)), SD(d,2.1), D_(circle(12,17.4,1.2))]
def shield3():
    body=("M11.1 2.0Q12 1.5 12.9 2.0C15 3.0 17.4 3.8 19.9 4.3C20.8 4.5 21.3 5.2 21.3 6.1V11.2"
          "C21.3 16.4 17.4 20.3 12.6 22.2C12.2 22.35 11.8 22.35 11.4 22.2"
          "C6.6 20.3 2.7 16.4 2.7 11.2V6.1C2.7 5.2 3.2 4.5 4.1 4.3C6.6 3.8 9 3.0 11.1 2.0Z")
    return [C_(body), SD(line((8.2,12.1),(10.9,14.7),(15.9,9.5)),2.1)]
APP.update({"bell":bell3,"bellOff":bell_off3,"cart":cart3})
EXTRA={}

# ------------------------------------------------------------ round 4 --
def bell4():
    # rim corners at ~r1.6 so the flare ends in a round lip, not a point
    body=("M12 1.9C15.9 1.9 18.2 4.9 18.2 8.6V11.1C18.2 12.9 19.1 14.4 20.4 15.6"
          "C22.4 17.4 21.6 18.8 19.4 18.8H4.6C2.4 18.8 1.6 17.4 3.6 15.6"
          "C4.9 14.4 5.8 12.9 5.8 11.1V8.6C5.8 4.9 8.1 1.9 12 1.9Z")
    return [C_(body), C_(rrect(8.8,20.1,6.4,2.8,1.4))]
def bell_off4():
    a,b=(3.6,2.4),(20.4,21.6)
    return bell4()+[SD(line(a,b),2.1+2*1.1), SC(line(a,b),2.1)]
def cart4():
    return [SC("M1.9 2.8H3.1C3.6 2.8 4.0 3.1 4.1 3.6L4.8 6.4",HW),
            C_(rpoly([(4.4,5.2),(22.2,5.2),(20.5,14.0),(6.3,14.0)],[1.0,1.8,2.2,1.4])),
            SC("M6.3 13.6L6.8 16.6H19.2",HW),
            SD(line((9.6,9.6),(17.4,9.6)),LW),
            C_(circle(8.4,20.4,2.05)),C_(circle(17.6,20.4,2.05))]
APP.update({"bell":bell4,"bellOff":bell_off4,"cart":cart4})

def cart5():
    return [SC("M1.9 2.8H3.1C3.6 2.8 4.0 3.1 4.1 3.6L5.2 7.2",HW),
            C_(rpoly([(4.4,5.2),(22.2,5.2),(20.5,13.8),(6.3,13.8)],[1.0,1.8,2.2,1.6])),
            SC("M7.4 12.6L7.8 16.2H19.2",HW),
            SD(line((9.6,9.5),(17.4,9.5)),LW),
            C_(circle(8.6,20.4,1.95)),C_(circle(17.6,20.4,1.95))]
APP.update({"cart":cart5})

# ------------------------------------------------------------ round 5 --
# Parts either overlap on purpose or keep a clear gap (>=1.0): a near-zero
# gap is exactly what rounding bridges or tears.
def gift5():
    return [C_(circle(9.3,5.0,2.5)),D_(circle(9.3,5.0,0.95)),C_(circle(14.7,5.0,2.5)),D_(circle(14.7,5.0,0.95)),
            C_(rrect(1.8,7.0,20.4,4.8,2.4)),
            C_(rpoly([(3.4,13.2),(20.6,13.2),(20.6,22.3),(3.4,22.3)],[0.9,0.9,3.8,3.8])),
            SD(line((12,6.2),(12,23.0)),LW)]
def coffee5():
    return [SC("M15.8 9.4H18.4a3.2 3.2 0 0 1 0 6.4H15.6",HW),
            C_(rpoly([(2.4,5.6),(18.0,5.6),(16.6,20.6),(3.8,20.6)],[1.6,1.6,3.8,3.8])),
            SD(line((1.0,10.2),(16.2,10.2)),LW)]
def bao5():
    return [C_(circle(12,2.9,1.9)), C_(squircle(12,13.4,20.6,14.6,2.6)),
            SD(line((10.6,7.6),(7.0,12.2)),LW), SD(line((12,8.0),(12,13.2)),LW), SD(line((13.4,7.6),(17.0,12.2)),LW)]
APP.update({"gift":gift5,"coffee":coffee5,"dimsum":bao5})

# ------------------------------------------------------------ round 6 --
def bowl6():
    # chopsticks parallel, 3.2 apart: converging ones left a thin wedge of gap
    a0,a1=(12.8,8.4),(18.6,1.6); o=(0.77*3.2,0.64*3.2)
    return [SC(line(a0,a1),HW), SC(line((a0[0]+o[0],a0[1]+o[1]),(a1[0]+o[0],a1[1]+o[1])),HW),
            C_("M3.8 11.2C3.8 7.8 7.4 5.6 12 5.6S20.2 7.8 20.2 11.2Z"), C_(_rim(12.6,1.7,22.3,8.4))]
def bao6():
    return [C_(circle(12,2.9,1.9)), C_(squircle(12,13.4,20.6,14.6,2.6)),
            SD("M10.3 8.0C8.6 8.8 7.5 10.2 7.1 12.2",LW), SD("M13.7 8.0C15.4 8.8 16.5 10.2 16.9 12.2",LW)]
def scooter6():
    return [C_(sq(5.9,6.4,7.4,6.6)),
            C_(rpoly([(1.8,11.0),(11.4,11.0),(13.6,14.6),(2.2,14.6)],[1.4,1.8,1.2,1.4])),
            SC(line((12.6,13.4),(16.2,13.4)),HW),
            SC(line((16.4,13.6),(18.0,4.8),(20.8,4.8)),HW),
            C_(circle(5.4,19.1,3.2)), D_(circle(5.4,19.1,1.15)),
            C_(circle(18.6,19.1,3.2)), D_(circle(18.6,19.1,1.15))]
APP.update({"bowl":bowl6,"dimsum":bao6,"scooter":scooter6,"bike":scooter6})

def bowl7():
    a0,a1=(12.2,7.2),(18.8,1.0); o=(0.77*3.2,0.64*3.2)
    return [SC(line(a0,a1),HW), SC(line((a0[0]+o[0],a0[1]+o[1]),(a1[0]+o[0],a1[1]+o[1])),HW),
            C_("M3.8 11.2C3.8 7.8 7.4 5.6 12 5.6S20.2 7.8 20.2 11.2Z"), C_(_rim(12.6,1.7,22.3,8.4))]
APP.update({"bowl":bowl7})
