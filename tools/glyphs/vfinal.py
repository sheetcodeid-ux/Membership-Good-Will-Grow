import os as _os
HERE=_os.path.dirname(_os.path.abspath(__file__))
import sys, json; sys.path.insert(0,HERE)
from multiprocessing import Pool
OLD={"home","order","member","profile","menu","logout"}     # stay on the previous glyphs
SYM={"info","heart","trash","lock","crown","download","bell","pin","bookmark","gift","plus","minus","close","more",
     "star","settings","eye","globe","pause","hourglass","infinity","grid","monitor","soup","dimsum","chefHat","shirt",
     "pos","building","store","alertCircle","alertTriangle","closeCircle","stack","help_body_dummy"}
def one(k):
    from build_set import build, centred, SCALE
    from vec import build_geom, round_geom, geom_to_d, deviation, polys, recentre
    from shapely import affinity
    S=build(); els=S[k]
    t,wh=centred(els); s=SCALE.get(k,1.0)
    G0=build_geom(els,t,s); G=recentre(round_geom(G0))
    top0=(len(polys(G0)),sum(len(p.interiors) for p in polys(G0)))
    top1=(len(polys(G)),sum(len(p.interiors) for p in polys(G)))
    d=geom_to_d(G); dev=deviation(d,G)
    x0,y0,x1,y1=G.bounds
    sym=None
    if k in SYM:
        M=affinity.scale(G,-1,1,origin=(12,12)); sym=G.intersection(M).area/G.union(M).area
    return k,{"d":d,"rule":"evenodd","w":x1-x0,"h":y1-y0,"cx":(x0+x1)/2,"cy":(y0+y1)/2,"dev":dev,
              "topo0":top0,"topo1":top1,"sym":sym,"moved":abs(G0.area-G.area)/G0.area,"len":len(d)}
if __name__=="__main__":
    from build_set import build
    names=[k for k in build() if k not in OLD and k!="bike"]
    res={}
    with Pool(4) as p:
        for k,v in p.imap_unordered(one,names): res[k]=v; print(k,flush=True)
    json.dump(res,open(f"{HERE}/vfinal.json","w"))
