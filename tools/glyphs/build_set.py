import os as _os
HERE=_os.path.dirname(_os.path.abspath(__file__))
import sys, json, io; sys.path.insert(0,HERE)
import numpy as np, cairosvg
from PIL import Image
from lib import svg_doc, to_svg
import g_ref
from g_profile import crown4, user_square
from g_app import APP
P=lambda k: json.load(open(f"{HERE}/params/p_{k}.json"))
R2={"mail_badge":g_ref.mail_badge2,"calendar":g_ref.calendar2,"chat_dots":g_ref.chat_dots2,"lock":g_ref.lock2,"help":g_ref.help2}
def fitted(k):
    p=P(k); b=R2[k] if p.get("model")==2 else g_ref.MODELS[k][0]
    return b(p["x"])
def build():
    S={}
    S["profile"]=user_square(json.load(open(f"{HERE}/params/p_user_square2.json"))["x"])
    S["crown"]=crown4(json.load(open(f"{HERE}/params/p_crown4.json"))["x"])
    for name,k in [("info","info"),("help","help"),("heart","heart"),("comment","chat_dots"),("chatLines","chat_lines"),
                   ("download","download_sq"),("activity","chart"),("lock","lock"),("shield","shield"),("trash","trash"),
                   ("order","bag_star"),("doc","clipboard"),("calendar","calendar"),("camera","camera"),
                   ("postAdd","list_plus"),("send","send"),("compose","pencil_spark")]:
        S[name]=fitted(k)
    S["shield"]=g_ref.shield5(json.load(open(f"{HERE}/params/p_shield5.json"))["x"])
    S["pencil"]=fitted("pencil_spark")[:2]
    S["mail"]=fitted("mail_badge")[:2]
    for k,fn in APP.items(): S[k]=fn()
    from g_app import EXTRA
    for k,fn in EXTRA.items(): S[k]=fn()
    return S
def bbox(els, px=240):
    png=cairosvg.svg2png(bytestring=svg_doc(els,px=px,ink="#000000",bg="#FFFFFF").encode())
    a=np.array(Image.open(io.BytesIO(png)).convert("L"))<128
    ys,xs=np.where(a); s=px/24
    return xs.min()/s, ys.min()/s, (xs.max()+1)/s, (ys.max()+1)/s
def centred(els):
    x0,y0,x1,y1=bbox(els); return (12-(x0+x1)/2, 12-(y0+y1)/2), (x1-x0, y1-y0)
# Per-glyph scale about the centre, for glyphs derived from a fitted one whose
# fitted size belonged to a composition (the pencil drawn beside a sparkle).
SCALE={"pencil":1.14,"refresh":1.12,"bowl":0.985}
