/* mcm-sheet.js — GENERADO, no editar. Hoja de canción de la app MCM (mcmapp/mcm-app/utils/songDocument*.ts, commit 967fab1). Regenerar con «npm run build:sheet-bundle» en mcm-app. */
"use strict";(()=>{function fc(r){return r&&r.__esModule?r.default:r}var Tr=class extends Error{},lc={Ab:{B:"Cb"},Bb:{B:"Cb"},Cb:{B:"Cb","A#":"Bb",E:"Fb"},C:{"C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb"},"C#":{Eb:"D#",Bb:"A#"},Db:{Cb:"B","F#":"Gb","G#":"Ab","A#":"Bb"},D:{"D#":"Eb","A#":"Bb",Gb:"F#"},Eb:{"D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb"},E:{Ab:"G#","A#":"Bb","D#":"Eb",Db:"C#",Eb:"D#"},F:{"A#":"Bb","F#":"Gb","D#":"Eb","G#":"Ab"},"F#":{Bb:"A#",Eb:"D#"},Gb:{"A#":"Bb","D#":"Eb","G#":"Ab",B:"Cb",E:"Fb"},G:{"A#":"Bb","D#":"Eb","G#":"Ab","C#":"Db"},"G#":{"A#":"Bb","D#":"Eb",Cb:"B#"},Am:{"G#":"Ab","F#":"Gb","C#":"Db","D#":"Eb","A#":"Bb"},Bbm:{Cb:"B",Gb:"F#"},Bm:{"A#":"Bb","D#":"Eb"},"C#m":{"A#":"Bb","D#":"Eb",Gb:"F#"},Cm:{"G#":"Ab","A#":"Bb","D#":"Eb","F#":"Gb","C#":"Db"},Dm:{"A#":"Bb","D#":"Eb","F#":"Gb","G#":"Ab","C#":"Db"},Em:{"A#":"Bb","D#":"Eb","C#":"Db"},"F#m":{"A#":"Bb","D#":"Eb",Gb:"F#",Ab:"G#",Db:"C#"},Fm:{"G#":"Ab","A#":"Bb","D#":"Eb","F#":"Gb","C#":"Db"},Gm:{"G#":"Ab","A#":"Bb","D#":"Eb","C#":"Db","F#":"Gb"},"G#m":{Bb:"A#",Eb:"D#"},B:{Eb:"D#"},Lab:{Si:"Dob"},Dob:{Si:"Dob","La#":"Sib",Mi:"Fab"},Do:{"Do#":"Reb","Re#":"Mib","Fa#":"Solb","Sol#":"Lab","La#":"Sib"},"Do#":{Mib:"Re#",Sib:"La#"},Reb:{Si:"Dob","Fa#":"Solb"},Re:{"Re#":"Mib","La#":"Sib",Solb:"Fa#"},Mib:{"Re#":"Mib","Fa#":"Solb","Sol#":"Lab","La#":"Sib"},Mi:{Lab:"Sol#","La#":"Sib","Re#":"Mib",Reb:"Do#",Mib:"Re#"},Fa:{"La#":"Sib","Fa#":"Solb","Re#":"Mib","Sol#":"Lab"},"Fa#":{Sib:"La#",Mib:"Re#"},Solb:{"La#":"Sib","Re#":"Mib","Sol#":"Lab",Si:"Dob",Mi:"Fab"},Sol:{"La#":"Sib","Re#":"Mib","Sol#":"Lab","Do#":"Reb"},"Sol#":{"La#":"Sib","Re#":"Mib",Dob:"Si#"},Lam:{"Sol#":"Lab","Fa#":"Solb","Do#":"Reb","Re#":"Mib","La#":"Sib"},Sibm:{Dob:"Si",Solb:"Fa#"},Sim:{"La#":"Sib","Re#":"Mib"},"Do#m":{"La#":"Sib","Re#":"Mib",Solb:"Fa#"},Dom:{"Sol#":"Lab","La#":"Sib","Re#":"Mib","Fa#":"Solb","Do#":"Reb"},Rem:{"La#":"Sib","Re#":"Mib","Fa#":"Solb","Sol#":"Lab","Do#":"Reb"},Mim:{"La#":"Sib","Re#":"Mib","Do#":"Reb"},"Fa#m":{"La#":"Sib","Re#":"Mib",Solb:"Fa#",Lab:"Sol#",Reb:"Do#"},Fam:{"Sol#":"Lab","La#":"Sib","Re#":"Mib","Fa#":"Solb","Do#":"Reb"},Solm:{"Sol#":"Lab","La#":"Sib","Re#":"Mib","Do#":"Reb","Fa#":"Solb"},"Sol#m":{Sib:"La#",Mib:"Re#"},Si:{Mib:"Re#"}},uc=lc,ot="bridge",Ts="chorus",li="grid",mc="indeterminate",Xs="none",ui="tab",ct="verse",Zt="part",mi="ly",gi="abc",hi="svg",di="textblock",Me="symbol",De="numeric",je="numeral",Oe="solfege";var dn=["I","II","III","IV","V","VI","VII"],re="b",ne="#",Zs="NM",he=Zs,ye="m",Ee="M";var Js="start_tag",Qs="end_tag",In="auto",It="german",Rn=Symbol.for("chordsheetjs.ChordLyricsPair"),_n=Symbol.for("chordsheetjs.Comment"),zn=Symbol.for("chordsheetjs.Literal"),On=Symbol.for("chordsheetjs.SoftLineBreak"),Wn=Symbol.for("chordsheetjs.Tag");function ft(r,s){Object.defineProperty(r,s,{value:!0,enumerable:!1,configurable:!1})}function lt(r,s){return!!(r&&typeof r=="object"&&r[s]===!0)}var Rt=class r{static[Symbol.hasInstance](s){return lt(s,Rn)}constructor(s="",e=null,a=null,f=null,l=!1){this.parentLine=null,this._chordObj=null,this.chords=s||"",this.lyrics=e||"",this.annotation=a||"",this._chordObj=f,this.isRhythmSymbol=l}get chord(){return this._chordObj||nt.parse(this.chords.trim())}isRenderable(){return!0}hasLyrics(){return!!(this.lyrics&&this.lyrics.trim().length>0)}clone(){var e;let s=((e=this._chordObj)==null?void 0:e.clone())||null;return new r(this.chords,this.lyrics,this.annotation,s,this.isRhythmSymbol)}toString(){return`ChordLyricsPair(chords=${this.chords}, lyrics=${this.lyrics})`}set({chords:s,lyrics:e,annotation:a,chordObj:f,isRhythmSymbol:l}){return new r(s!=null?s:this.chords,e!=null?e:this.lyrics,a!=null?a:this.annotation,f!=null?f:null,l!=null?l:this.isRhythmSymbol)}setLyrics(s){return this.set({lyrics:s})}setAnnotation(s){return this.set({annotation:s})}transpose(s,e=null,{normalizeChordSuffix:a}={normalizeChordSuffix:!1}){return this.changeChord(f=>{let l=f.transpose(s);return e?l.normalize(e,{normalizeSuffix:a}):l})}useAccidental(s){return this.changeChord(e=>e.useAccidental(s))}useModifier(s){return Je("useModifier is deprecated, use useAccidental instead"),this.useAccidental(s)}changeChord(s){let e=this.chord;if(e){let a=s(e);return this.set({chords:a.toString(),chordObj:a})}return this.clone()}};ft(Rt.prototype,Rn);var Fe=Rt,gc={2:"2",4:"sus",5:"5",6:"6",7:"7",9:"9",11:"11",13:"13",42:"4(2)",69:"6(9)","(#4)":"(#4)","#4":"(#4)","+4":"(#4)","(+4)":"(#4)","(11)":"(11)",add11:"(11)","(add11)":"(11)","(13)":"(13)",add13:"(13)","(add13)":"(13)","(2)":"(2)",add2:"(2)","(add2)":"(2)","(4)":"(4)",add4:"(4)","(add4)":"(4)","sus(4)":"(4)","(6)":"(6)",add6:"(6)","(add6)":"(6)","(7)":"(7)","(9)":"(9)",add9:"(9)","(add9)":"(9)","(b5)":"(b5)","-5":"(b5)","(-5)":"(b5)",b5:"(b5)","2(6)":"2(6)","(b6)":"(b6)","(unis)":"(unis)",unis:"(unis)","[blank]":"[blank]",maj:"[blank]",major:"[blank]",M:"[blank]",ma:"[blank]",Ma:"[blank]",Majj:"[blank]","+":"+",aug:"+","(#5)":"+","#5":"+","+5":"+","(+5)":"+",x:"+",dom11:"11","11(#5)":"11(#5)","11#5":"11(#5)","11+5":"11(#5)","11(+5)":"11(#5)","11(#9)":"11(#9)","11#9":"11(#9)","11+9":"11(#9)","11(+9)":"11(#9)","11(b13)":"11(b13)","11b13":"11(b13)","11-13":"11(b13)","11(-13)":"11(b13)","11(b5)":"11(b5)","11b5":"11(b5)","11-5":"11(b5)","11(-5)":"11(b5)","11(b9)":"11(b9)","11b9":"11(b9)","11-9":"11(b9)","11(-9)":"11(b9)","11sus4":"11sus4","11sus":"11sus4",m11sus4:"11sus4",m11sus:"11sus4",dom13:"13","13(#11)":"13(#11)","13#11":"13(#11)","13+11":"13(#11)","13(+11)":"13(#11)","13(#5)":"13(#5)","13#5":"13(#5)","13+5":"13(#5)","13(+5)":"13(#5)","13(#9)":"13(#9)","13#9":"13(#9)","13(+9)":"13(#9)","13+9":"13(#9)","13(#9#5)":"13(#9#5)","13#9#5":"13(#9#5)","13(+9+5)":"13(#9#5)","13+9+5":"13(#9#5)","13(#9b5)":"13(#9b5)","13#9b5":"13(#9b5)","13(+9-5)":"13(#9b5)","13+9-5":"13(#9b5)","13(add2)":"13(add2)","13(add4)":"13(add4)","13(b5)":"13(b5)","13b5":"13(b5)","13-5":"13(b5)","13(-5)":"13(b5)","13(b9)":"13(b9)","13b9":"13(b9)","13-9":"13(b9)","13(-9)":"13(b9)","13(b9#5)":"13(b9#5)","13b9#5":"13(b9#5)","13-9+5":"13(b9#5)","13(-9+5)":"13(b9#5)","13(b9b5)":"13(b9b5)","13b9b5":"13(b9b5)","13-9-5":"13(b9b5)","13(-9-5)":"13(b9b5)","13sus4":"13sus4","13sus":"13sus4",m13sus4:"13sus4",m13sus:"13sus4",sus2:"2","add9(no3)":"2","2(#11)":"2(#11)","2(#4)":"2(#4)","2+4":"2(#4)","2#4":"2(#4)","2(+4)":"2(#4)","(#4)2":"2(#4)","2(#4)(#42)(2#4)":"2(#4)(#42)(2#4)","2(+7)":"2(+7)","2(4)":"2(4)","sus2(4)":"2(4)","2(ma7)":"2(ma7)","2(no3)":"2(no3)","4(2)":"4(2)",sus42:"4(2)",no3:"5","(no3)":"5","5(no3)":"5","6(2)":"6(2)","6(b9)":"6(b9)","6(no3)":"6(no3)","6(9)":"6(9)","6(add9)":"6(9)",dom7:"7","7(#11)":"7(#11)","7#11":"7(#11)","7+11":"7(#11)","7(+11)":"7(#11)","7(#5)":"7(#5)",aug7:"7(#5)","7#5":"7(#5)","7+5":"7(#5)","7(+5)":"7(#5)",x7:"7(#5)","7(#5#11)":"7(#5#11)","7#5#11":"7(#5#11)","7+5+11":"7(#5#11)","7(+5+11)":"7(#5#11)","7(#9)":"7(#9)","7#9":"7(#9)","7+9":"7(#9)","7(+9)":"7(#9)","7(#9#5)":"7(#9#5)","7(#5#9)":"7(#9#5)","7#5#9":"7(#9#5)","7+5+9":"7(#9#5)","7(+5+9)":"7(#9#5)","7(#9b13)":"7(#9b13)","7#9b13":"7(#9b13)","7(+9-13)":"7(#9b13)","7+9-13":"7(#9b13)","7(b13#9)":"7(#9b13)","7b13#9":"7(#9b13)","7-13+9":"7(#9b13)","7(-13+9)":"7(#9b13)","7(#9b5)":"7(#9b5)","7(6)":"7(6)","7(b13)":"7(b13)","7b13":"7(b13)","7-13":"7(b13)","7(-13)":"7(b13)","7(b5)":"7(b5)","7b5":"7(b5)","7-5":"7(b5)","7(-5)":"7(b5)","7(b5#11)":"7(b5#11)","7b5#11":"7(b5#11)","7-5+11":"7(b5#11)","7(-5+11)":"7(b5#11)","7(b5#9)":"7(b5#9)","7b5#9":"7(b5#9)","7-5+9":"7(b5#9)","7(-5+9)":"7(b5#9)","7(b5b9)":"7(b5b9)","7b5b9":"7(b5b9)","7-5-9":"7(b5b9)","7(-5-9)":"7(b5b9)","7(b9)":"7(b9)","7b9":"7(b9)","7-9":"7(b9)","7(-9)":"7(b9)","7(b9#5)":"7(b9#5)","7(#5b9)":"7(b9#5)","7#5b9":"7(b9#5)","7+5-9":"7(b9#5)","7(+5-9)":"7(b9#5)","7(b9b13)":"7(b9b13)","7b9b13":"7(b9b13)","7-9-13":"7(b9b13)","7(-9-13)":"7(b9b13)","7(b13b9)":"7(b9b13)","7b13b9":"7(b9b13)","7-13-9":"7(b9b13)","7(-13-9)":"7(b9b13)","7(b9b5)":"7(b9b5)","7(no3)":"7(no3)","7aug5":"7aug5","7b9sus4":"7b9sus4","7sus(6)":"7sus(6)","7sus(b9)":"7sus(b9)","7sus4":"7sus4","7sus":"7sus4",dom9:"9","9(#11)":"9(#11)","9#11":"9(#11)","9+11":"9(#11)","9(+11)":"9(#11)","9(#5)":"9(#5)","9#5":"9(#5)","9+5":"9(#5)","9(+5)":"9(#5)",aug9:"9(#5)",x9:"9(#5)","9(b13)":"9(b13)","9b13":"9(b13)","9-13":"9(b13)","9(-13)":"9(b13)","9(b5)":"9(b5)","9b5":"9(b5)","9-5":"9(b5)","9(-5)":"9(b5)","9aug":"9aug","9sus4":"9sus4","9sus":"9sus4",m9sus4:"9sus4",m9sus:"9sus4","b69(#11)":"b69(#11)",b69sus:"b69sus",b9sus:"b9sus",dim:"dim","m(b5)":"dim",mb5:"dim","m-5":"dim","m(-5)":"dim","-(b5)":"dim","-b5":"dim",dim7:"dim7",o7:"dim7",m:"m",mi:"m",min:"m",minor:"m","-":"m","m(11)":"m(11)","m(add11)":"m(11)","m(4)":"m(4)","m(add4)":"m(4)","m(9)":"m(9)","m(add9)":"m(9)","m(ma7)":"m(ma7)","m(M7)":"m(ma7)",mM7:"m(ma7)","mi(maj7)":"m(ma7)","min(maj7)":"m(ma7)","m(maj7)":"m(ma7)","m(+7)":"m(ma7)","m+7":"m(ma7)",mmaj7:"m(ma7)","m(ma9)":"m(ma9)","m(M9)":"m(ma9)",mM9:"m(ma9)","mi(maj9)":"m(ma9)","min(maj9)":"m(ma9)","m(maj9)":"m(ma9)","m(+9)":"m(ma9)","m+9":"m(ma9)","m(no5)":"m(no5)",m11:"m11",mi11:"m11",min11:"m11","-11":"m11","m11(#5)":"m11(#5)","m11#5":"m11(#5)","m11+5":"m11(#5)","m11(+5)":"m11(#5)","-11(#5)":"m11(#5)","-11#5":"m11(#5)","m9+5":"m9(#5)","-11(+5)":"m11(#5)","m11(#9)":"m11(#9)","m11#9":"m11(#9)","m11+9":"m11(#9)","m11(+9)":"m11(#9)","-11(#9)":"m11(#9)","-11#9":"m11(#9)","-11+9":"m11(#9)","-11(+9)":"m11(#9)","m11(#9#5)":"m11(#9#5)","m11(#5#9)":"m11(#9#5)","m11#5#9":"m11(#9#5)","m11+5+9":"m11(#9#5)","m11(+5+9)":"m11(#9#5)","-11(#5#9)":"m11(#9#5)","-11#5#9":"m11(#9#5)","m9+5+9":"m11(#9#5)","-11(+5+9)":"m11(#9#5)","m11(#9b13)":"m11(#9b13)","m11#9b13":"m11(#9b13)","m11+9-13":"m11(#9b13)","m11(+9-13)":"m11(#9b13)","-11(#9b13)":"m11(#9b13)","-11#9b13":"m11(#9b13)","-11+9-13":"m11(#9b13)","-11(+9-13)":"m11(#9b13)","m11(b13)":"m11(b13)",m11b13:"m11(b13)","m11-13":"m11(b13)","m11(-13)":"m11(b13)","-11(b13)":"m11(b13)","-11b13":"m11(b13)","-11-13":"m11(b13)","-11(-13)":"m11(b13)","m11(b13#5)":"m11(b13#5)","m11(#5b13)":"m11(b13#5)","m11#5b13":"m11(b13#5)","m11+5-13":"m11(b13#5)","m11(+5-13)":"m11(b13#5)","-11(#5b13)":"m11(b13#5)","-11#5b13":"m11(b13#5)","-11+5-13":"m11(b13#5)","-11(+5-13)":"m11(b13#5)","m11(b5)":"m11(b5)",m11b5:"m11(b5)","m11-5":"m11(b5)","m11(-5)":"m11(b5)","-11(b5)":"m11(b5)","-11b5":"m11(b5)","-9-5":"m9(b5)","-11(-5)":"m11(b5)","m11(b5#9)":"m11(b5#9)","m11b5#9":"m11(b5#9)","m11-5+9":"m11(b5#9)","m11(-5+9)":"m11(b5#9)","-11(b5#9)":"m11(b5#9)","-11b5#9":"m11(b5#9)","-11-5+9":"m11(b5#9)","-11(-5+9)":"m11(b5#9)","m11(b5b13)":"m11(b5b13)",m11b5b13:"m11(b5b13)","m11(-5-13)":"m11(b5b13)","m11-5-13":"m11(b5b13)","-11(b5b13)":"m11(b5b13)","-11b5b13":"m11(b5b13)","-11(-5-13)":"m11(b5b13)","-11-5-13":"m11(b5b13)","m11(b5b9)":"m11(b5b9)",m11b5b9:"m11(b5b9)","m11-5-9":"m11(b5b9)","m11(-5-9)":"m11(b5b9)","-11(b5b9)":"m11(b5b9)","-11b5b9":"m11(b5b9)","-11-5-9":"m11(b5b9)","-11(-5-9)":"m11(b5b9)","m11(b9)":"m11(b9)",m11b9:"m11(b9)","m11(-9)":"m11(b9)","m11-9":"m11(b9)","-11(b9)":"m11(b9)","-11b9":"m11(b9)","-11(-9)":"m11(b9)","-11-9":"m11(b9)","m11(b9#5)":"m11(b9#5)","m11(#5b9)":"m11(b9#5)","m11#5b9":"m11(b9#5)","m11+5-9":"m11(b9#5)","m11(+5-9)":"m11(b9#5)","-11(#5b9)":"m11(b9#5)","-11#5b9":"m11(b9#5)","m9+5-9":"m11(b9#5)","-11(+5-9)":"m11(b9#5)","m11(b9b13)":"m11(b9b13)",m11b9b13:"m11(b9b13)","m11(-9-13)":"m11(b9b13)","m11-9-13":"m11(b9b13)","-11(b9b13)":"m11(b9b13)","-11b9b13":"m11(b9b13)","-11(-9-13)":"m11(b9b13)","-11-9-13":"m11(b9b13)",m13:"m13",mi13:"m13",min13:"m13","-13":"m13","m13(#11)":"m13(#11)","m13#11":"m13(#11)","m13+11":"m13(#11)","m13(+11)":"m13(#11)","-13(#11)":"m13(#11)","-13#11":"m13(#11)","-13+11":"m13(#11)","-13(+11)":"m13(#11)","m13(#5)":"m13(#5)","m13#5":"m13(#5)","m13+5":"m13(#5)","m13(+5)":"m13(#5)","-13(#5)":"m13(#5)","-13#5":"m13(#5)","-13(+5)":"m13(#5)","m13(#9)":"m13(#9)","m13#9":"m13(#9)","m13(+9)":"m13(#9)","m13+9":"m13(#9)","-13(#9)":"m13(#9)","-13#9":"m13(#9)","-13(+9)":"m13(#9)","-13+9":"m13(#9)","m13(b5)":"m13(b5)",m13b5:"m13(b5)","m13-5":"m13(b5)","m13(-5)":"m13(b5)","-13(b5)":"m13(b5)","-13b5":"m13(b5)","-13-5":"m13(b5)","-13(-5)":"m13(b5)","m13(b9)":"m13(b9)",m13b9:"m13(b9)","m13-9":"m13(b9)","m13(-9)":"m13(b9)","-13(b13)":"m13(b9)","-13b13":"m13(b9)","-13-13":"m13(b9)","-13(-13)":"m13(b9)",m2:"m2",mi2:"m2",min2:"m2","m(add2)":"m2",madd2:"m2",m4:"m4",m6:"m6",mi6:"m6",min6:"m6","-6":"m6","m6(#5)":"m6(#5)","m6(9)":"m6(9)",m6add9:"m6(9)","m6(add9)":"m6(9)",m69:"m6(9)","m6(ma7)":"m6(ma7)","m6(M7)":"m6(ma7)","m6(+7)":"m6(ma7)",m6M7:"m6(ma7)","m6+7":"m6(ma7)",m7:"m7",mi7:"m7",min7:"m7","-7":"m7","m7(#11)":"m7(#11)","m7#11":"m7(#11)","m7+11":"m7(#11)","m7(+11)":"m7(#11)","-7(#11)":"m7(#11)","-7#11":"m7(#11)","-7+11":"m7(#11)","-7(+11)":"m7(#11)","m7(#5)":"m7(#5)","m7#5":"m7(#5)","m7+5":"m7(#5)","m7(+5)":"m7(#5)","-7(#5)":"m7(#5)","-7#5":"m7(#5)","-7(+5)":"m7(#5)","m7(#9)":"m7(#9)","m7#9":"m7(#9)","m7+9":"m7(#9)","m7(+9)":"m7(#9)","-7(#9)":"m7(#9)","-7#9":"m7(#9)","-7(+9)":"m7(#9)","m7(11)":"m7(11)","m7(4)":"m7(4)","m7(add4)":"m7(4)","m7(add11)":"m7(4)",m74:"m7(4)","m7(6)":"m7(6)","m7(add6)":"m7(add6)","m7(b13)":"m7(b13)",m7b13:"m7(b13)","m7-13":"m7(b13)","m7(-13)":"m7(b13)","-7(b13)":"m7(b13)","-7b13":"m7(b13)","-7-13":"m7(b13)","-7(-13)":"m7(b13)","m7(b5)":"m7(b5)",m7b5:"m7(b5)","m7-5":"m7(b5)","m7(-5)":"m7(b5)","-7(b5)":"m7(b5)","-7b5":"m7(b5)","-7(-5)":"m7(b5)","m7(b9)":"m7(b9)",m7b9:"m7(b9)","m7-9":"m7(b9)","m7(-9)":"m7(b9)","-7(b9)":"m7(b9)","-7b9":"m7(b9)","-7(-9)":"m7(b9)","m7(no3)":"m7(no3)","min7(no3)":"m7(no3)",m7sus4:"m7sus4",m7sus:"m7sus4",m9:"m9",mi9:"m9",min9:"m9","-9":"m9","m9(#11)":"m9(#11)","m9#11":"m9(#11)","m9+11":"m9(#11)","m9(+11)":"m9(#11)","-9(#11)":"m9(#11)","-9#11":"m9(#11)","-9+11":"m9(#11)","-9(+11)":"m9(#11)","m9(#5)":"m9(#5)","m9#5":"m9(#5)","m9(+5)":"m9(#5)","-9(#5)":"m9(#5)","-9#5":"m9(#5)","-9(+5)":"m9(#5)","m9(#7)":"m9(#7)","m9(b13)":"m9(b13)",m9b13:"m9(b13)","m9-13":"m9(b13)","m9(-13)":"m9(b13)","-9(b13)":"m9(b13)","-9b13":"m9(b13)","-9-13":"m9(b13)","-9(-13)":"m9(b13)","m9(b5)":"m9(b5)",m9b5:"m9(b5)","m9-5":"m9(b5)","m9(-5)":"m9(b5)","-9(b5)":"m9(b5)","-9b5":"m9(b5)","-9(-5)":"m9(b5)","m9(ma7)":"m9(ma7)","m9(maj7)":"m9(ma7)","m9(+7)":"m9(ma7)","m9(M7)":"m9(ma7)",m9M7:"m9(ma7)",ma9:"ma9",maj9:"ma9",maj9b11:"maj9b11",ma11:"ma11","11(#7)":"ma11","11#7":"ma11","11+7":"ma11","11(+7)":"ma11","+11":"ma11",M11:"ma11","ma11(#5)":"ma11(#5)","maj11#5":"ma11(#5)","maj11+5":"ma11(#5)","maj11(+5)":"ma11(#5)","+11(#5)":"ma11(#5)","+11#5":"ma11(#5)","M11+5":"ma11(#5)","+11(+5)":"ma11(#5)","maj11(#5)":"ma11(#5)","ma11#5":"ma11(#5)","ma11+5":"ma11(#5)","ma11(+5)":"ma11(#5)","ma11(#9)":"ma11(#9)","maj11#9":"ma11(#9)","maj11+9":"ma11(#9)","maj11(+9)":"ma11(#9)","+11(#9)":"ma11(#9)","+11#9":"ma11(#9)","M11+9":"ma11(#9)","+11(+9)":"ma11(#9)","maj11(#9)":"ma11(#9)","ma11#9":"ma11(#9)","ma11+9":"ma11(#9)","ma11(+9)":"ma11(#9)","ma11(b13)":"ma11(b13)",maj11b13:"ma11(b13)","maj11-13":"ma11(b13)","maj11(-13)":"ma11(b13)","+11(b13)":"ma11(b13)","+11b13":"ma11(b13)","M11-13":"ma11(b13)","+11(-13)":"ma11(b13)","maj11(b13)":"ma11(b13)",ma11b13:"ma11(b13)","ma11-13":"ma11(b13)","ma11(-13)":"ma11(b13)","ma11(b5)":"ma11(b5)",maj11b5:"ma11(b5)","maj11-5":"ma11(b5)","maj11(-5)":"ma11(b5)","+11(b5)":"ma11(b5)","+11b5":"ma11(b5)","M11-5":"ma11(b5)","+11(-5)":"ma11(b5)","maj11(b5)":"ma11(b5)",ma11b5:"ma11(b5)","ma11-5":"ma11(b5)","ma11(-5)":"ma11(b5)","ma11(b9)":"ma11(b9)",maj11b9:"ma11(b9)","maj11(-9)":"ma11(b9)","maj11-9":"ma11(b9)","+11(b9)":"ma11(b9)","+11b9":"ma11(b9)","M11(-9)":"ma11(b9)","+11-9":"ma11(b9)","maj11(b9)":"ma11(b9)",ma11b9:"ma11(b9)","ma11(-9)":"ma11(b9)","ma11-9":"ma11(b9)",ma13:"ma13","13(#7)":"ma13","+13":"ma13",M13:"ma13",maj13:"ma13",Maj13:"ma13","ma13(#11)":"ma13(#11)","maj13#11":"ma13(#11)","maj13+11":"ma13(#11)","maj13(+11)":"ma13(#11)","+13(#11)":"ma13(#11)","+13#11":"ma13(#11)","M13+11":"ma13(#11)","+13(+11)":"ma13(#11)","maj13(#11)":"ma13(#11)","ma7#11":"ma9(#11)","ma13+11":"ma13(#11)","ma13(+11)":"ma13(#11)","ma13(#11#5)":"ma13(#11#5)","maj13#11#5":"ma13(#11#5)","maj13+11+5":"ma13(#11#5)","maj13(+11+5)":"ma13(#11#5)","+13(#11#5)":"ma13(#11#5)","+13#11#5":"ma13(#11#5)","M13+11+5":"ma13(#11#5)","+13(+11+5)":"ma13(#11#5)","maj13(#11#5)":"ma13(#11#5)","ma7#11#5":"ma9(#11#5)","ma13+11+5":"ma13(#11#5)","ma13(+11+5)":"ma13(#11#5)","ma13(#5)":"ma13(#5)","maj13#5":"ma13(#5)","maj13+5":"ma13(#5)","maj13(+5)":"ma13(#5)","+13(#5)":"ma13(#5)","+13#5":"ma13(#5)","M13+5":"ma13(#5)","+13(+5)":"ma13(#5)","maj13(#5)":"ma13(#5)","ma13#5":"ma13(#5)","ma13+5":"ma13(#5)","ma13(+5)":"ma13(#5)","ma13(#9)":"ma13(#9)","maj13#9":"ma13(#9)","maj13(+9)":"ma13(#9)","maj13+9":"ma13(#9)","+13(#9)":"ma13(#9)","+13#9":"ma13(#9)","M13(+9)":"ma13(#9)","+13+9":"ma13(#9)","maj13(#9)":"ma13(#9)","ma13#9":"ma13(#9)","ma13(+9)":"ma13(#9)","ma13+9":"ma13(#9)","ma13(#9#5)":"ma13(#9#5)","maj13#9#5":"ma13(#9#5)","maj13(+9+5)":"ma13(#9#5)","maj13+9+5":"ma13(#9#5)","+13(#9#5)":"ma13(#9#5)","+13#9#5":"ma13(#9#5)","M13(+9+5)":"ma13(#9#5)","+13+9+5":"ma13(#9#5)","maj13(#9#5)":"ma13(#9#5)","ma7#9#5":"ma13(#9#5)","ma13(+9+5)":"ma13(#9#5)","ma13+9+5":"ma13(#9#5)","ma13(b5)":"ma13(b5)",maj13b5:"ma13(b5)","maj13-5":"ma13(b5)","maj13(-5)":"ma13(b5)","+13(b5)":"ma13(b5)","+13b5":"ma13(b5)","M13-5":"ma13(b5)","+13(-5)":"ma13(b5)","maj13(b5)":"ma13(b5)",ma13b5:"ma13(b5)","ma13-5":"ma13(b5)","ma13(-5)":"ma13(b5)","ma13(b9)":"ma13(b9)",maj13b9:"ma13(b9)","maj13-9":"ma13(b9)","maj13(-9)":"ma13(b9)","+13(b9)":"ma13(b9)","+13b9":"ma13(b9)","M13-9":"ma13(b9)","+13(-9)":"ma13(b9)","maj13(b9)":"ma13(b9)",ma13b9:"ma13(b9)","ma13-9":"ma13(b9)","ma13(-9)":"ma13(b9)","ma13(b9#5)":"ma13(b9#5)","maj13b9#5":"ma13(b9#5)","maj13-9+5":"ma13(b9#5)","maj13(-9+5)":"ma13(b9#5)","+13(b9#5)":"ma13(b9#5)","+13b9#5":"ma13(b9#5)","M13-9+5":"ma13(b9#5)","+13(-9+5)":"ma13(b9#5)","maj13(b9#5)":"ma13(b9#5)","ma7b9#5":"ma13(b9#5)","ma13-9+5":"ma13(b9#5)","ma13(-9+5)":"ma13(b9#5)",ma6:"ma6","ma6(9)":"ma6(9)",ma69:"ma6(9)",ma7:"ma7","+7":"ma7","#7":"ma7",M7:"ma7",Maj7:"ma7",maj7:"ma7","(triangle)":"ma7","ma7(#11)":"ma7(#11)","maj7#11":"ma7(#11)","maj7+11":"ma7(#11)","maj7(+11)":"ma7(#11)","+7(#11)":"ma7(#11)","+7#11":"ma7(#11)","M7+11":"ma7(#11)","+7(+11)":"ma7(#11)","maj7(#11)":"ma7(#11)","ma7+11":"ma7(#11)","ma7(+11)":"ma7(#11)","ma7(#4)":"ma7(#4)","ma7(#5)":"ma7(#5)","maj7#5":"ma7(#5)","maj7+5":"ma7(#5)","maj7(+5)":"ma7(#5)","+7(#5)":"ma7(#5)","+7#5":"ma7(#5)","M7+5":"ma7(#5)","+7(+5)":"ma7(#5)","maj7(#5)":"ma7(#5)","ma7#5":"ma7(#5)","ma7+5":"ma7(#5)","ma7(+5)":"ma7(#5)","aug(M7)":"ma7(#5)","aug(+7)":"ma7(#5)","aug(ma7)":"ma7(#5)","aug(maj7)":"ma7(#5)","ma7(#9)":"ma7(#9)","maj7#9":"ma7(#9)","maj7+9":"ma7(#9)","maj7(+9)":"ma7(#9)","+7(#9)":"ma7(#9)","+7#9":"ma7(#9)","M7+9":"ma7(#9)","+7(+9)":"ma7(#9)","maj7(#9)":"ma7(#9)","ma7#9":"ma7(#9)","ma7+9":"ma7(#9)","ma7(+9)":"ma7(#9)","ma7(b13)":"ma7(b13)",maj7b13:"ma7(b13)","maj7-13":"ma7(b13)","maj7(-13)":"ma7(b13)","+7(b13)":"ma7(b13)","+7b13":"ma7(b13)","M7-13":"ma7(b13)","+7(-13)":"ma7(b13)","maj7(b13)":"ma7(b13)",ma7b13:"ma9(b13)","ma7-13":"ma7(b13)","ma7(-13)":"ma7(b13)","ma7(b5)":"ma7(b5)",maj7b5:"ma7(b5)","maj7-5":"ma7(b5)","maj7(-5)":"ma7(b5)","+7(b5)":"ma7(b5)","+7b5":"ma7(b5)","M7-5":"ma7(b5)","+7(-5)":"ma7(b5)","maj7(b5)":"ma7(b5)",ma7b5:"ma7(b5)","ma7-5":"ma7(b5)","ma7(-5)":"ma7(b5)","ma7(b9)":"ma7(b9)",maj7b9:"ma7(b9)","maj7-9":"ma7(b9)","maj7(-9)":"ma7(b9)","+7(b9)":"ma7(b9)","+7b9":"ma7(b9)","M7-9":"ma7(b9)","+7(-9)":"ma7(b9)","maj7(b9)":"ma7(b9)",ma7b9:"ma7(b9)","ma7-9":"ma7(b9)","ma7(-9)":"ma7(b9)","ma7(no3)":"ma7(no3)","9(#7)":"ma9","+9":"ma9",M9:"ma9","ma9(#11)":"ma9(#11)","maj9#11":"ma9(#11)","maj9+11":"ma9(#11)","maj9(+11)":"ma9(#11)","+9(#11)":"ma9(#11)","+9#11":"ma9(#11)","M9+11":"ma9(#11)","+9(+11)":"ma9(#11)","maj9(#11)":"ma9(#11)","ma9+11":"ma9(#11)","ma9(+11)":"ma9(#11)","ma9(#11#5)":"ma9(#11#5)","maj9#11#5":"ma9(#11#5)","maj9+11+5":"ma9(#11#5)","maj9(+11+5)":"ma9(#11#5)","+9(#11#5)":"ma9(#11#5)","+9#11#5":"ma9(#11#5)","M9+11+5":"ma9(#11#5)","+9(+11+5)":"ma9(#11#5)","maj9(#11#5)":"ma9(#11#5)","ma9+11+5":"ma9(#11#5)","ma9(+11+5)":"ma9(#11#5)","ma9(#4)":"ma9(#4)","ma9(#5)":"ma9(#5)","maj9#5":"ma9(#5)","maj9+5":"ma9(#5)","maj9(+5)":"ma9(#5)","+9(#5)":"ma9(#5)","+9#5":"ma9(#5)","M9+5":"ma9(#5)","+9(+5)":"ma9(#5)","maj9(#5)":"ma9(#5)","ma9#5":"ma9(#5)","ma9+5":"ma9(#5)","ma9(+5)":"ma9(#5)","ma9(13)":"ma9(13)","ma9(b13)":"ma9(b13)",maj9b13:"ma9(b13)","maj9-13":"ma9(b13)","maj9(-13)":"ma9(b13)","+9(b13)":"ma9(b13)","+9b13":"ma9(b13)","M9-13":"ma9(b13)","+9(-13)":"ma9(b13)","maj9(b13)":"ma9(b13)","ma9-13":"ma9(b13)","ma9(-13)":"ma9(b13)","ma9(b13#5)":"ma9(b13#5)","maj9b13#5":"ma9(b13#5)","maj9-13+5":"ma9(b13#5)","maj9(-13+5)":"ma9(b13#5)","+9(b13#5)":"ma9(b13#5)","+9b13#5":"ma9(b13#5)","M9-13+5":"ma9(b13#5)","+9(-13+5)":"ma9(b13#5)","maj9(b13#5)":"ma9(b13#5)","ma7b13#5":"ma9(b13#5)","ma9-13+5":"ma9(b13#5)","ma9(-13+5)":"ma9(b13#5)","ma9(b5)":"ma9(b5)",maj9b5:"ma9(b5)","maj9-5":"ma9(b5)","maj9(-5)":"ma9(b5)","+9(b5)":"ma9(b5)","+9b5":"ma9(b5)","M9-5":"ma9(b5)","+9(-5)":"ma9(b5)","maj9(b5)":"ma9(b5)",ma9b5:"ma9(b5)","ma9-5":"ma9(b5)","ma9(-5)":"ma9(b5)",sus:"sus",sus4:"sus","sus(no5)":"sus(no5)","sus#42":"sus#42","":""},bn=gc,hc={[Me]:{[Ee]:{[he]:{C:0,D:2,E:4,F:5,G:7,A:9,B:11},[ne]:{B:0,C:1,D:3,E:5,F:6,G:8,A:10},[re]:{D:1,E:3,F:4,G:6,A:8,B:10,C:11}},[ye]:{[he]:{C:0,D:2,E:4,F:5,G:7,A:9,B:11},[ne]:{B:0,C:1,D:3,E:5,F:6,G:8,A:10},[re]:{D:1,E:3,F:4,G:6,A:8,B:10,C:11}}},[Oe]:{[Ee]:{[he]:{Do:0,Re:2,Mi:4,Fa:5,Sol:7,La:9,Si:11},[ne]:{Si:0,Do:1,Re:3,Mi:5,Fa:6,Sol:8,La:10},[re]:{Re:1,Mi:3,Fa:4,Sol:6,La:8,Si:10,Do:11}},[ye]:{[he]:{Do:0,Re:2,Mi:4,Fa:5,Sol:7,La:9,Si:11},[ne]:{Si:0,Do:1,Re:3,Mi:5,Fa:6,Sol:8,La:10},[re]:{Re:1,Mi:3,Fa:4,Sol:6,La:8,Si:10,Do:11}}},[De]:{[Ee]:{[he]:{1:0,2:2,3:4,4:5,5:7,6:9,7:11},[ne]:{7:0,1:1,2:3,3:5,4:6,5:8,6:10},[re]:{2:1,3:3,4:4,5:6,6:8,7:10,1:11}},[ye]:{[he]:{1:0,2:2,3:3,4:5,5:7,6:8,7:10},[ne]:{1:1,2:3,3:4,4:6,5:8,6:9,7:11},[re]:{2:1,3:2,4:4,5:6,6:7,7:9,1:11}}},[je]:{[Ee]:{[he]:{I:0,II:2,III:4,IV:5,V:7,VI:9,VII:11},[ne]:{VII:0,I:1,II:3,III:5,IV:6,V:8,VI:10},[re]:{II:1,III:3,IV:4,V:6,VI:8,VII:10,I:11}},[ye]:{[he]:{I:0,II:2,III:3,IV:5,V:7,VI:8,VII:10},[ne]:{I:1,II:3,III:4,IV:6,V:8,VI:9,VII:11},[re]:{II:1,III:2,IV:4,V:6,VI:7,VII:9,I:11}}}},dc={[Me]:{[Ee]:{[he]:{0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"},[ne]:{0:"B#",1:"C#",3:"D#",5:"E#",6:"F#",8:"G#",10:"A#"},[re]:{1:"Db",3:"Eb",4:"Fb",6:"Gb",8:"Ab",10:"Bb",11:"Cb"}},[ye]:{[he]:{0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"},[ne]:{0:"B#",1:"C#",3:"D#",5:"E#",6:"F#",8:"G#",10:"A#"},[re]:{1:"Db",3:"Eb",4:"Fb",6:"Gb",8:"Ab",10:"Bb",11:"Cb"}}},[Oe]:{[Ee]:{[he]:{0:"Do",2:"Re",4:"Mi",5:"Fa",7:"Sol",9:"La",11:"Si"},[ne]:{0:"Si#",1:"Do#",3:"Re#",5:"Mi#",6:"Fa#",8:"Sol#",10:"La#"},[re]:{1:"Reb",3:"Mib",4:"Fab",6:"Solb",8:"Lab",10:"Sib",11:"Dob"}},[ye]:{[he]:{0:"Do",2:"Re",4:"Mi",5:"Fa",7:"Sol",9:"La",11:"Si"},[ne]:{0:"Si#",1:"Do#",3:"Re#",5:"Mi#",6:"Fa#",8:"Sol#",10:"La#"},[re]:{1:"Reb",3:"Mib",4:"Fab",6:"Solb",8:"Lab",10:"Sib",11:"Dob"}}},[De]:{[Ee]:{[he]:{0:"1",2:"2",4:"3",5:"4",7:"5",9:"6",11:"7"},[ne]:{0:"#7",1:"#1",3:"#2",5:"#3",6:"#4",8:"#5",10:"#6"},[re]:{1:"b2",3:"b3",4:"b4",6:"b5",8:"b6",10:"b7",11:"b1"}},[ye]:{[he]:{0:"1",2:"2",3:"3",5:"4",7:"5",8:"6",10:"7"},[ne]:{1:"#1",3:"#2",4:"#3",6:"#4",8:"#5",9:"#6",11:"#7"},[re]:{1:"b2",2:"b3",4:"b4",6:"b5",7:"b6",9:"b7",11:"b1"}}},[je]:{[Ee]:{[he]:{0:"I",2:"II",4:"III",5:"IV",7:"V",9:"VI",11:"VII"},[ne]:{0:"#VII",1:"#I",3:"#II",5:"#III",6:"#IV",8:"#V",10:"#VI"},[re]:{1:"bII",3:"bIII",4:"bIV",6:"bV",8:"bVI",10:"bVII",11:"bI"}},[ye]:{[he]:{0:"I",2:"II",3:"III",5:"IV",7:"V",8:"VI",10:"VII"},[ne]:{1:"#I",3:"#II",4:"#III",6:"#IV",8:"#V",9:"#VI",11:"#VII"},[re]:{1:"bII",2:"bIII",4:"bIV",6:"bV",7:"bVI",9:"bVII",11:"bI"}}}};function Hn(r){return r==="H"||r==="h"}function bc(r){return r==="H"?"B":r==="h"?"b":r}function pn(r){return r.startsWith("H")?`B${r.slice(1)}`:r}function pc(r,s,e){return e===It&&s===null&&(r==="B"||r==="b")?re:null}function $c(r,s){return s||(Hn(r)?It:null)}function Er(r,s,e,a){let f=hc[e][a?ye:Ee][s],l=e===Me?bc(r):r;if(l in f)return f[l];let h=l.toUpperCase();return h in f?f[h]:null}function Vn(r){let s=globalThis.process;typeof s=="object"&&typeof s.emitWarning=="function"?s.emitWarning(r):console.warn(r)}function Je(r){try{throw new Error(`DEPRECATION: ${r}`)}catch(s){Vn(`${r}
${s.stack}`)}}function xc(r){return r==null||r===""}function yc(r,s,e){switch(s){case je:return typeof r=="string"&&r.toLowerCase()===r;default:return typeof e=="string"&&e[0]==="m"&&e.substring(0,2).toLowerCase()!=="ma"&&e.substring(0,3).toLowerCase()!=="maj"}}function Cc(r){return r.replace(/\r\n?/g,`
`)}var Mr=class{constructor(s){this.grades=s}determineGrade(s,e,a){return this.getGradeForAccidental(s,a)||this.getGradeForAccidental(Zs,a)||this.getGradeForAccidental(e,a)||this.getGradeForAccidental(ne,a)}getGradeForAccidental(s,e){return s?this.grades[s][e]:null}};function Ac({type:r,accidental:s,preferredAccidental:e,grade:a,minor:f}){let l=f?ye:Ee,h=dc[r][l];return new Mr(h).determineGrade(s,e,a)}function Sc(r){let{type:s,accidental:e,preferredAccidental:a,grade:f,minor:l}=r,h=Ac({type:s,accidental:e,preferredAccidental:a,grade:f,minor:l});if(!h)throw new Error(`Could not resolve ${r} to a key`);return l&&s===je&&(h=h.toLowerCase()),h}function Pt(r){return r===null||bn[r]==="[blank]"?null:bn[r]||r}var Kn;function Ec(r,s){let e={...r};return Object.keys(s).forEach(a=>{let f=r[a],l=s[a];f&&typeof f=="object"&&!Array.isArray(f)&&l&&typeof l=="object"&&!Array.isArray(l)?e[a]=Kn(f,l):e[a]=l}),e}Kn=(r,s)=>s==null?r:r==null||typeof r!="object"||typeof s!="object"||Array.isArray(s)?s:Ec(r,s);function Fc(r,s){return Object.fromEntries(Object.entries(r).filter(([e,a])=>s(e,a)))}var Lc={symbol:/^(?<key>((?<note>[A-Ha-h])(?<accidental>#|b)?))(?<minor>m)?$/,solfege:/^(?<key>((?<note>Do|Re|Mi|Fa|Sol|La|Si|do|re|mi|fa|sol|la|si)(?<accidental>#|b)?))(?<minor>m)?$/,numeric:/^(?<key>(?<accidental>#|b)?(?<note>[1-7]))(?<minor>m)?$/,numeral:/^(?<key>(?<accidental>#|b)?(?<note>I{1,3}|IV|VI{0,2}|i{1,3}|iv|vi{0,2}))$/},$n=[Me,Oe,De,je],wc=[1,2,3,4,5,8,9,10],vc=[4,11],Dc=[1,4],Tc=[5,0],Mc=[3,7],xn=[2,3,10],Gr=class r{get unicodeAccidental(){switch(this.accidental){case re:return"\u266D";case ne:return"\u266F";default:return null}}get unicodeModifier(){return Je("unicodeModifier is deprecated, use unicodeAccidental instead"),this.unicodeAccidental}get modifier(){return Je("modifier is deprecated, use accidental instead"),this.accidental}get preferredModifier(){return Je("preferredModifier is deprecated, use preferredAccidental instead"),this.preferredAccidental}static parse(s){if(!s)return null;let e=s.trim();if(!e)return null;for(let a=0,f=$n.length;a<f;a+=1){let l=this.parseAsType(e,$n[a]);if(l)return l}return null}static parseAsType(s,e){let a=s.match(Lc[e]);if(!a)return null;let{minor:f,note:l,accidental:h}=a.groups;return this.resolve({key:l,keyType:e,minor:f||!1,accidental:h||null,preferredNotation:e===Me&&Hn(l)?It:null})}static resolve({key:s,keyType:e,minor:a,accidental:f,preferredNotation:l}){var w;let h=`${s}`,S=this.isMinor(h,e,a),D=$c(h,l),A=(w=pc(h,f,D))!=null?w:f,x=e===Me||e===Oe?Er(h,A||Zs,e,S):null;return x!==null?new r({grade:0,minor:S,type:e,accidental:f||null,preferredAccidental:f||null,referenceKeyGrade:x,originalKeyString:h,preferredNotation:D}):new r({number:this.getNumberFromKey(h,e),minor:S,type:e,accidental:f||null,preferredAccidental:f||null,originalKeyString:h})}static getNumberFromKey(s,e){if(e===De)return parseInt(s,10);let a=s.toUpperCase();return dn.findIndex(f=>a===f)+1}static keyWithAccidental(s,e,a){let f=s.toUpperCase(),l=e||"";return a===Oe?`${s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}${l}`:a===Me?`${f}${l}`:`${l}${f}`}static keyWithModifier(s,e,a){return Je("keyWithModifier is deprecated, use keyWithAccidental instead"),this.keyWithAccidental(s,e,a)}static isMinor(s,e,a){switch(e){case"numeral":return s.toLowerCase()===s;default:switch(typeof a){case"string":return a==="m"||a.toLowerCase()==="min";case"boolean":return a;default:return!1}}}static parseOrFail(s){let e=this.parse(s);if(!e)throw new Error(`Failed to parse ${s}`);return e}static wrap(s){return s instanceof r?s:s===null?null:this.parse(s)}static wrapOrFail(s=null){if(s===null)throw new Error("Unexpected null key");let e=this.wrap(s);if(e===null)throw new Error(`Failed: invalid key ${s}`);return e}static toString(s){return`${r.wrapOrFail(s)}`}static distance(s,e){return this.wrapOrFail(s).distanceTo(e)}constructor({grade:s=null,number:e=null,minor:a,type:f,accidental:l,referenceKeyGrade:h=null,referenceKeyMode:S=null,originalKeyString:D=null,preferredAccidental:A=null,explicitAccidental:x=!1,preferredNotation:w=null}){this.number=null,this.minor=!1,this.referenceKeyGrade=null,this.referenceKeyMode=null,this.originalKeyString=null,this.explicitAccidental=!1,this.preferredNotation=null,this.grade=s,this.number=e,this.minor=a,this.type=f,this.accidental=l,this.preferredAccidental=A,this.referenceKeyGrade=h,this.referenceKeyMode=S,this.originalKeyString=D,this.explicitAccidental=x,this.preferredNotation=w}distanceTo(s){let e=r.wrapOrFail(s);return r.shiftGrade(e.effectiveGrade-this.effectiveGrade)}get effectiveGrade(){if(this.grade===null)throw new Error("Cannot calculate effectiveGrade without a grade");return r.shiftGrade(this.grade+(this.referenceKeyGrade||0))}isMinor(){return this.minor}makeMinor(){return this.set({minor:!0})}get relativeMajor(){return this.changeGrade(3).set({minor:!1})}get relativeMinor(){return this.changeGrade(-3).set({minor:!0})}toMajor(){return this.isMinor()?this.transpose(3).set({minor:!1}):this.clone()}clone(){return this.set({})}ensureGrade(){this.grade===null&&this.calculateGradeFromNumber()}calculateGradeFromNumber(){if(this.number===null)throw new Error("Cannot calculate grade, number is null");this.grade=Er(this.number.toString(),this.accidental||Zs,De,this.isMinor()),this.number=null}toChordSymbol(s,e=!1){return this.isChordSymbol()?this.clone():this.convertToChordType(s,Me,e)}toChordSolfege(s,e=!1){return this.isChordSolfege()?this.clone():this.convertToChordType(s,Oe,e)}convertToChordType(s,e,a){let{accidental:f}=this,l=r.wrapOrFail(s);this.rebaseNumeralGradeForMajorReference(a),this.ensureGrade();let h=this.handleMinorKeyConversion(l,a);if(h)return h;let D=this.set({referenceKeyGrade:r.shiftGrade(this.effectiveGrade+l.effectiveGrade),grade:0,type:e,accidental:null,preferredAccidental:f||l.accidental}).normalizeEnharmonics(l);return f?D.set({preferredAccidental:f,accidental:null}):D}rebaseNumeralGradeForMajorReference(s){if(s||!this.minor||!this.originalKeyString||!(this.isNumeral()||this.isNumeric()))return;let e=r.getNumberFromKey(this.originalKeyString,this.type),a=e?Er(e.toString(),this.accidental||Zs,De,!1):null;a!==null&&(this.grade=a,this.number=null)}handleMinorKeyConversion(s,e){return!(this.isNumeral()||this.isNumeric())||!e?null:this.grade===8?s.relativeMinor:this.grade===7?s.relativeMinor.changeGrade(-1):this.grade===9?s.relativeMinor.changeGrade(1):null}toChordSymbolString(s){return this.toChordSymbol(s).toString()}toChordSolfegeString(s){return this.toChordSolfege(s).toString()}is(s){return this.type===s}isNumeric(){return this.is(De)}isChordSymbol(){return this.is(Me)}isChordSolfege(){return this.is(Oe)}isNumeral(){return this.is(je)}equals(s){return this.grade===s.grade&&this.number===s.number&&this.accidental===s.accidental&&this.preferredAccidental===s.preferredAccidental&&this.type===s.type&&this.minor===s.minor}static equals(s,e){return s===null?e===null:e===null?!1:s.equals(e)}toNumeric(s=null){if(this.isNumeric())return this.clone();if(this.isNumeral())return this.set({type:De});let e=r.wrapOrFail(s),a=e.effectiveGrade,f=e.minor?ye:Ee,l=r.shiftGrade(this.effectiveGrade-a),h=e.accidental;return xn.includes(l)&&(h=re),this.set({type:De,grade:r.shiftGrade(this.effectiveGrade-a),referenceKeyGrade:0,accidental:null,preferredAccidental:h,referenceKeyMode:f})}toNumericString(s=null){return this.toNumeric(s).toString()}toNumeral(s=null){if(this.isNumeral())return this.clone();if(this.isNumeric())return this.set({type:je});let e=r.wrapOrFail(s),a=e.effectiveGrade,f=e.minor?ye:Ee,l=r.shiftGrade(this.effectiveGrade-a),h=e.accidental;return xn.includes(l)&&(h=re),this.set({type:je,grade:r.shiftGrade(this.effectiveGrade-a),referenceKeyGrade:0,accidental:null,preferredAccidental:h,referenceKeyMode:f})}toNumeralString(s=null){return this.toNumeral(s).toString()}toString({showMinor:s=!0,useUnicodeModifier:e=!1}={}){let{note:a}=this;return e&&(a=a.replace("#","\u266F").replace("b","\u266D")),`${a}${s?this.minorSign:""}`}get note(){if(this.grade===null)return this.getNoteForNumber();if((this.isChordSymbol()||this.isChordSolfege())&&this.referenceKeyGrade===null)throw new Error("Not possible, reference key grade is null");let{minor:s}=this;this.referenceKeyMode&&(s=this.referenceKeyMode===ye);let e=Sc({type:this.type,accidental:this.accidental,preferredAccidental:this.preferredAccidental,grade:this.effectiveGrade,minor:s});return this.applyGermanRendering(e)}applyGermanRendering(s){return this.preferredNotation!==It||!this.isChordSymbol()?s:this.accidental===null&&this.effectiveGrade===10?"B":s==="B"?"H":s}getNoteForNumber(){if(this.number===null)throw new Error("Not possible, grade and number are null");if(this.isNumeric())return`${this.accidental||""}${this.number}`;let s=dn[this.number-1];return`${this.accidental||""}${this.isMinor()?s.toLowerCase():s}`}get minorSign(){if(!this.minor)return"";switch(this.type){case Me:return"m";case Oe:return"m";case De:return this.isNaturalMinor()?"":"m";default:return""}}isNaturalMinor(){if(this.ensureGrade(),!this.grade)throw new Error("Expected grade to be set, but it is is still empty.");return wc.includes(this.grade)}transpose(s){if(s===0)return this;let e=this.accidental,a=this.clone(),f=s<0?"transposeDown":"transposeUp";for(let l=0,h=Math.abs(s);l<h;l+=1)a=a[f]();return a.useAccidental(e)}changeGrade(s){return this.referenceKeyGrade?this.set({referenceKeyGrade:r.shiftGrade(this.referenceKeyGrade+s)}):(this.ensureGrade(),this.set({grade:r.shiftGrade(this.grade+s)}))}transposeUp(){let e=this.normalize().changeGrade(1);return this.accidental||!e.canBeSharp()?e=e.useAccidental(null):e.canBeSharp()&&(e=e.useAccidental(ne)),e=e.set({preferredAccidental:ne}).normalize(),e}transposeDown(){let e=this.normalize().changeGrade(-1);return this.accidental||!e.canBeFlat()?e=e.useAccidental(null):e.canBeFlat()&&(e=e.useAccidental(re)),e.set({preferredAccidental:re})}canBeFlat(){var a;let s=this.number!==null?Dc:vc,e=(a=this.number)!=null?a:this.effectiveGrade;return!s.includes(e)}canBeSharp(){var a;let s=this.number!==null?Mc:Tc,e=(a=this.number)!=null?a:this.effectiveGrade;return!s.includes(e)}setGrade(s){return this.set({grade:r.shiftGrade(s)})}static shiftGrade(s){return s<0?this.shiftGrade(s+12):s%12}useAccidental(s){return this.ensureGrade(),this.set({accidental:s,explicitAccidental:s!==null})}useModifier(s){return Je("useModifier is deprecated, use useAccidental instead"),this.useAccidental(s)}normalize(){return this.ensureGrade(),this.accidental===ne&&!this.canBeSharp()?this.set({accidental:null}):this.accidental===re&&!this.canBeFlat()?this.set({accidental:null}):this.clone()}normalizeEnharmonics(s){if(s){if(this.explicitAccidental)return this.clone();let e=pn(r.wrapOrFail(s).toString({showMinor:!0})),a=uc[e],f=pn(this.toString({showMinor:!1}));if(a&&a[f])return r.parseOrFail(a[f]).set({minor:this.minor,preferredNotation:this.preferredNotation})}return this.clone()}set(s,e=!0){return new r({...e?{}:s,grade:this.grade,number:this.number,type:this.type,accidental:this.accidental,minor:this.minor,referenceKeyGrade:this.referenceKeyGrade,originalKeyString:this.originalKeyString,preferredAccidental:this.preferredAccidental,explicitAccidental:this.explicitAccidental,preferredNotation:this.preferredNotation,...e?s:{}})}},Te=Gr;function Fr(r,s,e){return e=e||" ",r.length>s?r:(s-=r.length,e+=e.repeat(s),r+e.slice(0,s))}var et=class r extends Error{static buildMessage(s,e){function a(A){return A.charCodeAt(0).toString(16).toUpperCase()}function f(A){return A.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function l(A){return A.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function h(A){switch(A.type){case"literal":return'"'+f(A.text)+'"';case"class":let x=A.parts.map(w=>Array.isArray(w)?l(w[0])+"-"+l(w[1]):l(w));return"["+(A.inverted?"^":"")+x+"]";case"any":return"any character";case"end":return"end of input";case"other":return A.description}}function S(A){let x=A.map(h),w,P;if(x.sort(),x.length>0){for(w=1,P=1;w<x.length;w++)x[w-1]!==x[w]&&(x[P]=x[w],P++);x.length=P}switch(x.length){case 1:return x[0];case 2:return x[0]+" or "+x[1];default:return x.slice(0,-1).join(", ")+", or "+x[x.length-1]}}function D(A){return A?'"'+f(A)+'"':"end of input"}return"Expected "+S(s)+" but "+D(e)+" found."}constructor(s,e,a,f){super(),this.message=s,this.expected=e,this.found=a,this.location=f,this.name="PeggySyntaxError",typeof Object.setPrototypeOf=="function"?Object.setPrototypeOf(this,r.prototype):this.__proto__=r.prototype,typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,r)}format(s){let e="Error: "+this.message;if(this.location){let a=null,f;for(f=0;f<s.length;f++)if(s[f].grammarSource===this.location.source){a=s[f].text.split(/\r\n|\n|\r/g);break}let l=this.location.start,h=this.location.source+":"+l.line+":"+l.column;if(a){let S=this.location.end,D=Fr("",l.line.toString().length," "),A=a[l.line-1],x=l.line===S.line?S.column:A.length+1;e+=`
 --> `+h+`
`+D+` |
`+l.line+" | "+A+`
`+D+" | "+Fr("",l.column-1," ")+Fr("",x-l.column,"^")}else e+=`
 at `+h}return e}};function Gc(r,s){s=s!==void 0?s:{};let e={},a=s.grammarSource,f={Chord:$t},l=$t,h="(",S=q("(",!1),D=")",A=q(")",!1),x=function(u){return{type:"chord",...u,column:Ae().start.column,optional:!0}},w=function(u){return{type:"chord",...u,column:Ae().start.column}},P=/^[#b]/,j=as(["#","b"],!1,!1),X=function(u,p,E,M){let N=typeof E=="string"||E===null?{suffix:E}:{quality:E.quality,extensions:E.extensions};return{base:u,accidental:p,...N,...M,chordType:"symbol"}},ie=function(u){return{base:null,accidental:null,suffix:null,...u,chordType:"symbol"}},U=/^[A-Ha-h]/,V=as([["A","H"],["a","h"]],!1,!1),W="/",K=q("/",!1),Y=function(u,p){return{bassBase:u,bassAccidental:p}},Z=function(u,p,E,M){let N=typeof E=="string"||E===null?{suffix:E}:{quality:E.quality,extensions:E.extensions};return{base:u,accidental:p,...N,...M,chordType:"solfege"}},be=function(u){return{base:null,accidental:null,suffix:null,...u,chordType:"solfege"}},Ce="do",Le=q("Do",!0),ce="re",J=q("Re",!0),fe="mi",ae=q("Mi",!0),de="sol",ke=q("Sol",!0),Gs="la",Ne=q("La",!0),ss="si",gs=q("Si",!0),Q="Fa",te=q("Fa",!1),hs="dd",ts=q("dd",!0),He="ug",ds=q("ug",!0),Ve=function(){return"Fa"},Ie="fa",Bs=q("fa",!1),js=function(){return"fa"},Ke=function(u,p,E,M){let N=typeof E=="string"||E===null?{suffix:E}:{quality:E.quality,extensions:E.extensions};return{base:p,accidental:u,...N,...M,chordType:"numeral"}},qe=function(u){return{base:null,accidental:null,suffix:null,...u,chordType:"numeral"}},v="iii",oe=q("III",!0),se="vii",z=q("VII",!0),Ue="ii",H=q("II",!0),Re="iv",Ye=q("IV",!0),gt="vi",ht=q("VI",!0),bs=/^[IV]/i,pe=as(["I","V"],!1,!0),$e=function(u,p){return{bassBase:p,bassAccidental:u}},dt=function(u,p,E,M){let N=typeof E=="string"||E===null?{suffix:E}:{quality:E.quality,extensions:E.extensions};return{base:p,accidental:u,...N,...M,chordType:"numeric"}},Ps=function(u){return{base:null,accidental:null,suffix:null,...u,chordType:"numeric"}},rs=/^[1-7]/,ps=as([["1","7"]],!1,!1),Ge=function(u,p){return{quality:u||null,extensions:p||null}},ee="m",$s=q("m",!1),xs="a",is=q("a",!0),ys=function(){return"m"},ks="dim",Ns=q("dim",!0),Cs="aug",Is=q("aug",!0),Rs="sus4",_s=q("sus4",!0),As="sus2",zs=q("sus2",!0),Os="sus",ns=q("sus",!0),Ws="",_e=/^[a-zA-Z0-9#+\-o\u266D\u266F\u0394]/,Xe=as([["a","z"],["A","Z"],["0","9"],"#","+","-","o","\u266D","\u266F","\u0394"],!1,!1),Hs=function(u){return"("+u+")"},m=0,O=0,we=[{line:1,column:1}],d=0,C=[],L=0,B;if(s.startRule!==void 0){if(!(s.startRule in f))throw new Error(`Can't start parsing from rule "`+s.startRule+'".');l=f[s.startRule]}function ue(){return r.substring(O,m)}function Ae(){return os(O,m)}function xe(u,p){throw p=p!==void 0?p:os(O,m),pt([ur(u)],r.substring(O,m),p)}function Di(u,p){throw p=p!==void 0?p:os(O,m),mr(u,p)}function q(u,p){return{type:"literal",text:u,ignoreCase:p}}function as(u,p,E){return{type:"class",parts:u,inverted:p,ignoreCase:E}}function fr(){return{type:"any"}}function lr(){return{type:"end"}}function ur(u){return{type:"other",description:u}}function bt(u){let p=we[u],E;if(p)return p;for(E=u-1;!we[E];)E--;for(p=we[E],p={line:p.line,column:p.column};E<u;)r.charCodeAt(E)===10?(p.line++,p.column=1):p.column++,E++;return we[u]=p,p}function os(u,p){let E=bt(u),M=bt(p);return{source:a,start:{offset:u,line:E.line,column:E.column},end:{offset:p,line:M.line,column:M.column}}}function R(u){m<d||(m>d&&(d=m,C=[]),C.push(u))}function mr(u,p){return new et(u,[],"",p)}function pt(u,p,E){return new et(et.buildMessage(u,p),u,p,E)}function $t(){let u,p,E,M;return u=m,r.charCodeAt(m)===40?(p=h,m++):(p=e,L===0&&R(S)),p!==e?(E=qs(),E===e&&(E=Us(),E===e&&(E=Vs(),E===e&&(E=xt()))),E!==e?(r.charCodeAt(m)===41?(M=D,m++):(M=e,L===0&&R(A)),M!==e?(O=u,p=x(E),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=qs(),p===e&&(p=Us(),p===e&&(p=Vs(),p===e&&(p=xt()))),p!==e&&(O=u,p=w(p)),u=p),u}function ve(){let u;return P.test(r.charAt(m))?(u=r.charAt(m),m++):(u=e,L===0&&R(j)),u}function xt(){let u,p,E,M,N;return u=m,p=yt(),p!==e?(E=ve(),E===e&&(E=null),E!==e?(M=Ss(),M!==e?(N=Ct(),N===e&&(N=null),N!==e?(O=u,p=X(p,E,M,N),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=Ct(),p!==e&&(O=u,p=ie(p)),u=p),u}function yt(){let u;return U.test(r.charAt(m))?(u=r.charAt(m),m++):(u=e,L===0&&R(V)),u}function Ct(){let u,p,E,M;return u=m,r.charCodeAt(m)===47?(p=W,m++):(p=e,L===0&&R(K)),p!==e?(E=yt(),E!==e?(M=ve(),M===e&&(M=null),M!==e?(O=u,p=Y(E,M),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u}function Vs(){let u,p,E,M,N;return u=m,p=At(),p!==e?(E=ve(),E===e&&(E=null),E!==e?(M=Ss(),M!==e?(N=Ks(),N===e&&(N=null),N!==e?(O=u,p=Z(p,E,M,N),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=Ks(),p!==e&&(O=u,p=be(p)),u=p),u}function At(){let u;return r.substr(m,2).toLowerCase()===Ce?(u=r.substr(m,2),m+=2):(u=e,L===0&&R(Le)),u===e&&(r.substr(m,2).toLowerCase()===ce?(u=r.substr(m,2),m+=2):(u=e,L===0&&R(J)),u===e&&(r.substr(m,2).toLowerCase()===fe?(u=r.substr(m,2),m+=2):(u=e,L===0&&R(ae)),u===e&&(u=St(),u===e&&(r.substr(m,3).toLowerCase()===de?(u=r.substr(m,3),m+=3):(u=e,L===0&&R(ke)),u===e&&(r.substr(m,2).toLowerCase()===Gs?(u=r.substr(m,2),m+=2):(u=e,L===0&&R(Ne)),u===e&&(r.substr(m,2).toLowerCase()===ss?(u=r.substr(m,2),m+=2):(u=e,L===0&&R(gs)))))))),u}function St(){let u,p,E,M;return u=m,r.substr(m,2)===Q?(p=Q,m+=2):(p=e,L===0&&R(te)),p!==e?(E=m,L++,r.substr(m,2).toLowerCase()===hs?(M=r.substr(m,2),m+=2):(M=e,L===0&&R(ts)),M===e&&(r.substr(m,2).toLowerCase()===He?(M=r.substr(m,2),m+=2):(M=e,L===0&&R(ds))),L--,M===e?E=void 0:(m=E,E=e),E!==e?(O=u,p=Ve(),u=p):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,r.substr(m,2)===Ie?(p=Ie,m+=2):(p=e,L===0&&R(Bs)),p!==e?(E=m,L++,r.substr(m,2).toLowerCase()===hs?(M=r.substr(m,2),m+=2):(M=e,L===0&&R(ts)),M===e&&(r.substr(m,2).toLowerCase()===He?(M=r.substr(m,2),m+=2):(M=e,L===0&&R(ds))),L--,M===e?E=void 0:(m=E,E=e),E!==e?(O=u,p=js(),u=p):(m=u,u=e)):(m=u,u=e)),u}function Ks(){let u,p,E,M;return u=m,r.charCodeAt(m)===47?(p=W,m++):(p=e,L===0&&R(K)),p!==e?(E=At(),E!==e?(M=ve(),M===e&&(M=null),M!==e?(O=u,p=Y(E,M),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u}function qs(){let u,p,E,M,N;return u=m,p=ve(),p===e&&(p=null),p!==e?(E=Et(),E!==e?(M=Ss(),M!==e?(N=Ft(),N===e&&(N=null),N!==e?(O=u,p=Ke(p,E,M,N),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=Ft(),p!==e&&(O=u,p=qe(p)),u=p),u}function Et(){let u;return r.substr(m,3).toLowerCase()===v?(u=r.substr(m,3),m+=3):(u=e,L===0&&R(oe)),u===e&&(r.substr(m,3).toLowerCase()===se?(u=r.substr(m,3),m+=3):(u=e,L===0&&R(z)),u===e&&(r.substr(m,2).toLowerCase()===Ue?(u=r.substr(m,2),m+=2):(u=e,L===0&&R(H)),u===e&&(r.substr(m,2).toLowerCase()===Re?(u=r.substr(m,2),m+=2):(u=e,L===0&&R(Ye)),u===e&&(r.substr(m,2).toLowerCase()===gt?(u=r.substr(m,2),m+=2):(u=e,L===0&&R(ht)),u===e&&(bs.test(r.charAt(m))?(u=r.charAt(m),m++):(u=e,L===0&&R(pe))))))),u}function Ft(){let u,p,E,M;return u=m,r.charCodeAt(m)===47?(p=W,m++):(p=e,L===0&&R(K)),p!==e?(E=ve(),E===e&&(E=null),E!==e?(M=Et(),M!==e?(O=u,p=$e(E,M),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u}function Us(){let u,p,E,M,N;return u=m,p=ve(),p===e&&(p=null),p!==e?(E=Lt(),E!==e?(M=Ss(),M!==e?(N=wt(),N===e&&(N=null),N!==e?(O=u,p=dt(p,E,M,N),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=wt(),p!==e&&(O=u,p=Ps(p)),u=p),u}function Lt(){let u;return rs.test(r.charAt(m))?(u=r.charAt(m),m++):(u=e,L===0&&R(ps)),u}function wt(){let u,p,E,M;return u=m,r.charCodeAt(m)===47?(p=W,m++):(p=e,L===0&&R(K)),p!==e?(E=ve(),E===e&&(E=null),E!==e?(M=Lt(),M!==e?(O=u,p=$e(E,M),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u}function Ss(){let u,p,E,M,N;if(u=m,p=gr(),p!==e){for(E=m,M=[],N=vt();N!==e;)M.push(N),N=vt();M!==e?E=r.substring(E,m):E=M,E!==e?(O=u,p=Ge(p,E),u=p):(m=u,u=e)}else m=u,u=e;return u}function gr(){let u,p,E,M;return u=m,r.charCodeAt(m)===109?(p=ee,m++):(p=e,L===0&&R($s)),p!==e?(E=m,L++,r.substr(m,1).toLowerCase()===xs?(M=r.charAt(m),m++):(M=e,L===0&&R(is)),L--,M===e?E=void 0:(m=E,E=e),E!==e?(O=u,p=ys(),u=p):(m=u,u=e)):(m=u,u=e),u===e&&(r.substr(m,3).toLowerCase()===ks?(u=r.substr(m,3),m+=3):(u=e,L===0&&R(Ns)),u===e&&(r.substr(m,3).toLowerCase()===Cs?(u=r.substr(m,3),m+=3):(u=e,L===0&&R(Is)),u===e&&(r.substr(m,4).toLowerCase()===Rs?(u=r.substr(m,4),m+=4):(u=e,L===0&&R(_s)),u===e&&(r.substr(m,4).toLowerCase()===As?(u=r.substr(m,4),m+=4):(u=e,L===0&&R(zs)),u===e&&(r.substr(m,3).toLowerCase()===Os?(u=r.substr(m,3),m+=3):(u=e,L===0&&R(ns)),u===e&&(u=Ws)))))),u}function vt(){let u,p,E,M,N;if(u=m,r.charCodeAt(m)===40?(p=h,m++):(p=e,L===0&&R(S)),p!==e){if(E=m,M=[],_e.test(r.charAt(m))?(N=r.charAt(m),m++):(N=e,L===0&&R(Xe)),N!==e)for(;N!==e;)M.push(N),_e.test(r.charAt(m))?(N=r.charAt(m),m++):(N=e,L===0&&R(Xe));else M=e;M!==e?E=r.substring(E,m):E=M,E!==e?(r.charCodeAt(m)===41?(M=D,m++):(M=e,L===0&&R(A)),M!==e?(O=u,p=Hs(E),u=p):(m=u,u=e)):(m=u,u=e)}else m=u,u=e;if(u===e){if(u=m,p=[],_e.test(r.charAt(m))?(E=r.charAt(m),m++):(E=e,L===0&&R(Xe)),E!==e)for(;E!==e;)p.push(E),_e.test(r.charAt(m))?(E=r.charAt(m),m++):(E=e,L===0&&R(Xe));else p=e;p!==e?u=r.substring(u,m):u=p}return u}if(B=l(),B!==e&&m===r.length)return B;throw B!==e&&m<r.length&&R(lr()),pt(C,d<r.length?r.charAt(d):null,d<r.length?os(d,d+1):os(d,d))}var Bc=Gc,Br=class r{get suffix(){return this._quality!==null||this._extensions!==null?(this._quality||"")+(this._extensions||""):this._suffix}get quality(){return this._quality}get extensions(){return this._extensions}static parse(s,e={}){try{return this.parseOrFail(s,e)}catch{return null}}static parseOrFail(s,e={}){var f;let a=s.trim();try{let l=Bc(a);return new r({...l,notation:(f=e.notation)!=null?f:null})}catch(l){let h=l;throw new Tr(`Failed parsing '${a}': ${h.message}`)}}clone(){return this.set({})}toChordSymbol(s=null){var l,h;if(this.isChordSymbol())return this.clone();let{keyObj:e,referenceIsMinor:a}=this.prepareKeyForConversion(s),f=new r({suffix:this.normalizedSuffix,root:((l=this.root)==null?void 0:l.toChordSymbol(e,a))||null,bass:((h=this.bass)==null?void 0:h.toChordSymbol(e,a))||null,optional:this.optional});return this.finalizeConvertedChord(f,e)}toChordSymbolString(s=null){return this.toChordSymbol(s).toString()}isChordSymbol(){return this.is(Me)}toChordSolfege(s=null){var f,l;if(this.isChordSolfege())return this.clone();let{keyObj:e}=this.prepareKeyForConversion(s),a=new r({suffix:this.normalizedSuffix,root:((f=this.root)==null?void 0:f.toChordSolfege(e))||null,bass:((l=this.bass)==null?void 0:l.toChordSolfege(e))||null,optional:this.optional});return this.finalizeConvertedChord(a,s)}toChordSolfegeString(s=null){return this.toChordSolfege(s).toString()}isChordSolfege(){return this.is(Oe)}toNumeric(s=null){var a,f;if(this.isNumeric())return this.clone();if(this.isNumeral())return this.transform(l=>l.toNumeric());let e=Te.wrap(s);return e&&e.isMinor()&&(e=e.relativeMajor),new r({suffix:Pt(this.suffix),root:((a=this.root)==null?void 0:a.toNumeric(e))||null,bass:((f=this.bass)==null?void 0:f.toNumeric(e))||null,...this.optional?{optional:!0}:{}})}toNumeral(s=null){var a;if(this.isNumeral())return this.clone();if(this.isNumeric())return this.transform(f=>f.toNumeral());let e=Te.wrap(s);return e&&e.isMinor()&&(e=e.relativeMajor),new r({suffix:Pt(this.suffix),root:e&&this.root?this.root.toNumeral(e):null,bass:((a=this.bass)==null?void 0:a.toNumeral(e))||null,...this.optional?{optional:!0}:{}})}toNumeralString(s=null){return this.toNumeral(s).toString()}isNumeric(){return this.is(De)}toNumericString(s=null){return this.toNumeric(s).toString()}isNumeral(){return this.is(je)}toString({useUnicodeModifier:s=!1}={}){let e=this.unicodeSuffix(s),{root:a,suffix:f}=this.renderRoot(e,s),l=a+f;return this.bass&&(l=`${l}/${this.bass.toString({useUnicodeModifier:s})}`),this.optional&&(l=`(${l})`),l}unicodeSuffix(s){let e=this.suffix||"";return s?e.replace(/#(?=\d)/g,"\u266F").replace(/b(?=\d)/g,"\u266D"):e}renderRoot(s,e){if(!this.root)return{root:"",suffix:s};let a=s[0]!=="m",f=this.root.toString({showMinor:a,useUnicodeModifier:e});if(this.root.is(je)&&this.isMinor()){let l=s.startsWith("m")?s.substring(1):s;return{root:f.toLowerCase(),suffix:l}}return{root:f,suffix:s}}normalize(s=null,{normalizeSuffix:e=!0}={}){let a=e?Pt(this.suffix):this.suffix,f=this.root;return this.root&&(f=this.root.normalize(),s&&(f=f.normalizeEnharmonics(s))),this.set({suffix:a,root:f,bass:this.bass?this.bass.normalize().normalizeEnharmonics(f):null})}useAccidental(s){return this.transform(e=>e.useAccidental(s))}useModifier(s){return Je("useModifier is deprecated, use useAccidental instead"),this.useAccidental(s)}transposeUp(){return this.transform(s=>s.transposeUp())}transposeDown(){return this.transform(s=>s.transposeDown())}transpose(s){return this.transform(e=>e.transpose(s))}constructor(s){var e,a,f,l;this._quality=(e=s.quality)!=null?e:null,this._extensions=(a=s.extensions)!=null?a:null,this._suffix=(f=s.suffix)!=null?f:null,this.optional=(l=s.optional)!=null?l:!1,this.root=r.determineRoot({...s,suffix:this.suffix}),this.bass=r.determineBass(s)}equals(s){return this.suffix===s.suffix&&this.optional===s.optional&&Te.equals(this.root,s.root)&&Te.equals(this.bass,s.bass)}static determineRoot(s){let{root:e,base:a,accidental:f,suffix:l,chordType:h,notation:S}=s;if(e)return e;if(!a)return null;if(!h)throw new Error("Can't resolve at this point without a chord type");return Te.resolve({key:a,keyType:h,minor:yc(a,h,l!=null?l:null),accidental:f!=null?f:null,preferredNotation:S!=null?S:null})}static determineBass(s){let{bass:e,bassBase:a,bassAccidental:f,chordType:l,notation:h}=s;if(e)return e;if(!a)return null;if(!l)throw new Error("Can't resolve at this point without a chord type");return Te.resolve({key:a,accidental:f!=null?f:null,minor:!1,keyType:l,preferredNotation:h!=null?h:null})}isMinor(){var s;return((s=this.root)==null?void 0:s.isMinor())||!1}makeMinor(){var s;return this.set({root:((s=this.root)==null?void 0:s.makeMinor())||null})}set(s){var a,f;let e=this.determineSuffixProps(s);return new r({root:((a=this.root)==null?void 0:a.clone())||null,...e,bass:((f=this.bass)==null?void 0:f.clone())||null,...this.optional?{optional:!0}:{},...s})}determineSuffixProps(s){var e,a;return"suffix"in s?{suffix:s.suffix,quality:null,extensions:null}:"quality"in s||"extensions"in s?{quality:(e=s.quality)!=null?e:this._quality,extensions:(a=s.extensions)!=null?a:this._extensions}:this._quality!==null||this._extensions!==null?{quality:this._quality,extensions:this._extensions}:{suffix:this._suffix}}is(s){return(!this.root||this.root.is(s))&&(!this.bass||this.bass.is(s))}transform(s){return this.set({root:this.root?s(this.root):null,bass:this.bass?s(this.bass):null})}get normalizedSuffix(){return this.suffix?Pt(this.suffix):null}prepareKeyForConversion(s){let e=Te.wrap(s),a=(e==null?void 0:e.isMinor())||!1;return{keyObj:a?(e==null?void 0:e.relativeMajor)||null:e,referenceIsMinor:a}}finalizeConvertedChord(s,e){var f;let a=s;return(f=this.root)!=null&&f.isMinor()&&(a=a.makeMinor()),a.normalize(e)}},nt=Br;function Lr(r,s,e){return e=e||" ",r.length>s?r:(s-=r.length,e+=e.repeat(s),r+e.slice(0,s))}var st=class r extends Error{static buildMessage(s,e){function a(A){return A.charCodeAt(0).toString(16).toUpperCase()}function f(A){return A.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function l(A){return A.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function h(A){switch(A.type){case"literal":return'"'+f(A.text)+'"';case"class":let x=A.parts.map(w=>Array.isArray(w)?l(w[0])+"-"+l(w[1]):l(w));return"["+(A.inverted?"^":"")+x+"]";case"any":return"any character";case"end":return"end of input";case"other":return A.description}}function S(A){let x=A.map(h),w,P;if(x.sort(),x.length>0){for(w=1,P=1;w<x.length;w++)x[w-1]!==x[w]&&(x[P]=x[w],P++);x.length=P}switch(x.length){case 1:return x[0];case 2:return x[0]+" or "+x[1];default:return x.slice(0,-1).join(", ")+", or "+x[x.length-1]}}function D(A){return A?'"'+f(A)+'"':"end of input"}return"Expected "+S(s)+" but "+D(e)+" found."}constructor(s,e,a,f){super(),this.message=s,this.expected=e,this.found=a,this.location=f,this.name="PeggySyntaxError",typeof Object.setPrototypeOf=="function"?Object.setPrototypeOf(this,r.prototype):this.__proto__=r.prototype,typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,r)}format(s){let e="Error: "+this.message;if(this.location){let a=null,f;for(f=0;f<s.length;f++)if(s[f].grammarSource===this.location.source){a=s[f].text.split(/\r\n|\n|\r/g);break}let l=this.location.start,h=this.location.source+":"+l.line+":"+l.column;if(a){let S=this.location.end,D=Lr("",l.line.toString().length," "),A=a[l.line-1],x=l.line===S.line?S.column:A.length+1;e+=`
 --> `+h+`
`+D+` |
`+l.line+" | "+A+`
`+D+" | "+Lr("",l.column-1," ")+Lr("",x-l.column,"^")}else e+=`
 at `+h}return e}};function jc(r,s){s=s!==void 0?s:{};let e={},a=s.grammarSource,f={ChordDefinitionValue:is},l=is,h="frets",S=pe("frets",!1),D=function(d,C,L,B){return{name:d,baseFret:C||1,frets:L,fingers:B,text:Ye()}},A="/",x=pe("/",!1),w=/^[A-Ga-g]/,P=$e([["A","G"],["a","g"]],!1,!1),j=/^[b#\u266D\u266F]/,X=$e(["b","#","\u266D","\u266F"],!1,!1),ie="es",U=pe("es",!1),V="s",W=pe("s",!1),K="is",Y=pe("is",!1),Z=/^[a-zA-Z0-9#\u266Fb\u266D()+\-\/\xF8\u0394\u2212]/,be=$e([["a","z"],["A","Z"],["0","9"],"#","\u266F","b","\u266D","(",")","+","-","/","\xF8","\u0394","\u2212"],!1,!1),Ce="base-fret",Le=pe("base-fret",!1),ce=function(d){return d},J="fingers",fe=pe("fingers",!1),ae=function(d){return d},de=function(d){return d},ke=/^[\-A-Za-z]/,Gs=$e(["-",["A","Z"],["a","z"]],!1,!1),Ne=/^[0-9]/,ss=$e([["0","9"]],!1,!1),gs=function(d){return parseInt(d,10)},Q=function(d){return d},te="0",hs=pe("0",!1),ts=function(){return 0},He="-1",ds=pe("-1",!1),Ve=/^[NXnx]/,Ie=$e(["N","X","n","x"],!1,!1),Bs=rs("whitespace"),js=rs("optional whitespace"),Ke=/^[ \t\n\r]/,qe=$e([" ","	",`
`,"\r"],!1,!1),v=0,oe=0,se=[{line:1,column:1}],z=0,Ue=[],H=0,Re;if(s.startRule!==void 0){if(!(s.startRule in f))throw new Error(`Can't start parsing from rule "`+s.startRule+'".');l=f[s.startRule]}function Ye(){return r.substring(oe,v)}function gt(){return Ge(oe,v)}function ht(d,C){throw C=C!==void 0?C:Ge(oe,v),xs([rs(d)],r.substring(oe,v),C)}function bs(d,C){throw C=C!==void 0?C:Ge(oe,v),$s(d,C)}function pe(d,C){return{type:"literal",text:d,ignoreCase:C}}function $e(d,C,L){return{type:"class",parts:d,inverted:C,ignoreCase:L}}function dt(){return{type:"any"}}function Ps(){return{type:"end"}}function rs(d){return{type:"other",description:d}}function ps(d){let C=se[d],L;if(C)return C;for(L=d-1;!se[L];)L--;for(C=se[L],C={line:C.line,column:C.column};L<d;)r.charCodeAt(L)===10?(C.line++,C.column=1):C.column++,L++;return se[d]=C,C}function Ge(d,C){let L=ps(d),B=ps(C);return{source:a,start:{offset:d,line:L.line,column:L.column},end:{offset:C,line:B.line,column:B.column}}}function ee(d){v<z||(v>z&&(z=v,Ue=[]),Ue.push(d))}function $s(d,C){return new st(d,[],"",C)}function xs(d,C,L){return new st(st.buildMessage(d,C),d,C,L)}function is(){let d,C,L,B,ue,Ae,xe;if(d=v,C=ys(),C!==e)if(L=O(),L!==e)if(B=Rs(),B===e&&(B=null),B!==e)if(r.substr(v,5)===h?(ue=h,v+=5):(ue=e,H===0&&ee(S)),ue!==e){if(Ae=[],xe=ns(),xe!==e)for(;xe!==e;)Ae.push(xe),xe=ns();else Ae=e;Ae!==e?(xe=_s(),xe===e&&(xe=null),xe!==e?(oe=d,C=D(C,B,Ae,xe),d=C):(v=d,d=e)):(v=d,d=e)}else v=d,d=e;else v=d,d=e;else v=d,d=e;else v=d,d=e;return d}function ys(){let d,C,L,B;return d=v,C=v,L=ks(),L!==e?(B=Ns(),B===e&&(B=null),B!==e?(L=[L,B],C=L):(v=C,C=e)):(v=C,C=e),C!==e?d=r.substring(d,v):d=C,d}function ks(){let d,C,L,B;return d=v,C=v,L=Cs(),L!==e?(B=Is(),B===e&&(B=null),B!==e?(L=[L,B],C=L):(v=C,C=e)):(v=C,C=e),C!==e?d=r.substring(d,v):d=C,d}function Ns(){let d,C,L,B;return d=v,C=v,r.charCodeAt(v)===47?(L=A,v++):(L=e,H===0&&ee(x)),L!==e?(B=Cs(),B!==e?(L=[L,B],C=L):(v=C,C=e)):(v=C,C=e),C!==e?d=r.substring(d,v):d=C,d}function Cs(){let d,C,L,B;return d=v,C=v,w.test(r.charAt(v))?(L=r.charAt(v),v++):(L=e,H===0&&ee(P)),L!==e?(j.test(r.charAt(v))?(B=r.charAt(v),v++):(B=e,H===0&&ee(X)),B===e&&(r.substr(v,2)===ie?(B=ie,v+=2):(B=e,H===0&&ee(U)),B===e&&(r.charCodeAt(v)===115?(B=V,v++):(B=e,H===0&&ee(W)),B===e&&(r.substr(v,2)===K?(B=K,v+=2):(B=e,H===0&&ee(Y))))),B===e&&(B=null),B!==e?(L=[L,B],C=L):(v=C,C=e)):(v=C,C=e),C!==e?d=r.substring(d,v):d=C,d}function Is(){let d,C,L;if(d=v,C=[],Z.test(r.charAt(v))?(L=r.charAt(v),v++):(L=e,H===0&&ee(be)),L!==e)for(;L!==e;)C.push(L),Z.test(r.charAt(v))?(L=r.charAt(v),v++):(L=e,H===0&&ee(be));else C=e;return C!==e?d=r.substring(d,v):d=C,d}function Rs(){let d,C,L,B,ue;return d=v,r.substr(v,9)===Ce?(C=Ce,v+=9):(C=e,H===0&&ee(Le)),C!==e?(L=m(),L!==e?(B=_e(),B!==e?(ue=m(),ue!==e?(oe=d,C=ce(B),d=C):(v=d,d=e)):(v=d,d=e)):(v=d,d=e)):(v=d,d=e),d}function _s(){let d,C,L,B,ue;if(d=v,C=m(),C!==e)if(r.substr(v,7)===J?(L=J,v+=7):(L=e,H===0&&ee(fe)),L!==e){if(B=[],ue=As(),ue!==e)for(;ue!==e;)B.push(ue),ue=As();else B=e;B!==e?(oe=d,C=ae(B),d=C):(v=d,d=e)}else v=d,d=e;else v=d,d=e;return d}function As(){let d,C,L;return d=v,C=m(),C!==e?(L=zs(),L!==e?(oe=d,C=de(L),d=C):(v=d,d=e)):(v=d,d=e),d}function zs(){let d;return d=Os(),d===e&&(ke.test(r.charAt(v))?(d=r.charAt(v),v++):(d=e,H===0&&ee(Gs))),d}function Os(){let d,C;return d=v,Ne.test(r.charAt(v))?(C=r.charAt(v),v++):(C=e,H===0&&ee(ss)),C!==e&&(oe=d,C=gs(C)),d=C,d}function ns(){let d,C,L;return d=v,C=m(),C!==e?(L=Ws(),L!==e?(oe=d,C=Q(L),d=C):(v=d,d=e)):(v=d,d=e),d}function Ws(){let d,C,L;return d=v,C=O(),C!==e?(L=_e(),L===e&&(L=Xe(),L===e&&(L=Hs())),L!==e?(oe=d,C=Q(L),d=C):(v=d,d=e)):(v=d,d=e),d}function _e(){let d,C;return d=v,Ne.test(r.charAt(v))?(C=r.charAt(v),v++):(C=e,H===0&&ee(ss)),C!==e&&(oe=d,C=gs(C)),d=C,d}function Xe(){let d,C;return d=v,r.charCodeAt(v)===48?(C=te,v++):(C=e,H===0&&ee(hs)),C!==e&&(oe=d,C=ts()),d=C,d}function Hs(){let d;return r.substr(v,2)===He?(d=He,v+=2):(d=e,H===0&&ee(ds)),d===e&&(Ve.test(r.charAt(v))?(d=r.charAt(v),v++):(d=e,H===0&&ee(Ie))),d}function m(){let d,C;if(H++,d=[],C=we(),C!==e)for(;C!==e;)d.push(C),C=we();else d=e;return H--,d===e&&(C=e,H===0&&ee(Bs)),d}function O(){let d,C;for(H++,d=[],C=we();C!==e;)d.push(C),C=we();return H--,d===e&&(C=e,H===0&&ee(js)),d}function we(){let d;return Ke.test(r.charAt(v))?(d=r.charAt(v),v++):(d=e,H===0&&ee(qe)),d}if(Re=l(),Re!==e&&v===r.length)return Re;throw Re!==e&&v<r.length&&ee(Ps()),xs(Ue,z<r.length?r.charAt(z):null,z<r.length?Ge(z,z+1):Ge(z,z))}var Pc=jc;var jr=class r{constructor(s,e,a,f){this.name=s,this.baseFret=e,this.frets=a,this.fingers=f||[]}static parse(s){let{name:e,baseFret:a,frets:f,fingers:l}=Pc(s.trim());return new r(e,a,f,l)}clone(){return new r(this.name,this.baseFret,[...this.frets],[...this.fingers])}},qn=jr,_t=class r{static[Symbol.hasInstance](s){return lt(s,_n)}constructor(s){this.parentLine=null,this.content=s}isRenderable(){return!1}clone(){return new r(this.content)}toString(){return`Comment(content=${this.content})`}};ft(_t.prototype,_n);var tt=_t,Pr=class{constructor(s=null){this.parentLine=null,this.line=null,this.column=null,this.offset=null,s&&(this.line=s.line||null,this.column=s.column||null,this.offset=s.offset||null)}},Un=Pr,Yn="album",kc="arranger",Xn="artist",Jt="capo",bi="comment",Zn="composer",Jn="copyright",Qn="duration",ea="image",Nc="end_of_abc",pi="end_of_bridge",Qt="end_of_chorus",sa="end_of_grid",Ic="end_of_ly",ta="end_of_tab",$i="end_of_verse",zt="end_of_part",Ms="key",kt="_key",ra="lyricist",Rc="sorttitle",ia="start_of_abc",er="start_of_bridge",ut="start_of_chorus",xi="start_of_grid",na="start_of_ly",yi="start_of_tab",aa="start_of_svg",_c="end_of_svg",oa="start_of_textblock",zc="end_of_textblock",sr="start_of_verse",at="start_of_part",Ci="subtitle",ca="tempo",fa="time",Ai="title",Oc="transpose",la="new_key",ua="year",Ot="chordfont",Wt="chordsize",kr="chordcolour",Ht="textfont",Vt="textsize",Nr="textcolour";var Si="chorus",Wc="chord_style",yn={[ia]:gi,[er]:ot,[ut]:Si,[xi]:li,[na]:mi,[aa]:hi,[yi]:ui,[oa]:di,[sr]:ct},Cn={[Nc]:gi,[pi]:ot,[Qt]:Si,[sa]:li,[Ic]:mi,[_c]:hi,[ta]:ui,[zc]:di,[$i]:ct},Hc=/^start_of_(.+)$/,Vc=/^end_of_(.+)$/,Ir=class{static interpret(s,e){return new this(s,e).interpret()}constructor(s,e){this.tagName=s,this.tagValue=e}interpret(){return this.startOfPart()||this.endOfPart()||this.sectionStart()||this.sectionEnd()||this.startOfSection()||this.endOfSection()||[null,null]}startOfPart(){return this.tagName===at&&this.tagValue?[Js,this.tagValue.split(" ")[0].toLowerCase()]:null}endOfPart(){return this.tagName===zt?[Qs,In]:null}sectionStart(){return this.tagName in yn?[Js,yn[this.tagName]]:null}sectionEnd(){return this.tagName in Cn?[Qs,Cn[this.tagName]]:null}startOfSection(){let s=Hc.exec(this.tagName);return s?[Js,s[1]]:null}endOfSection(){let s=Vc.exec(this.tagName);return s?[Qs,s[1]]:null}},Rr=Ir,Kc="cf",qc="cs",ma="c",Uc="eob",Yc="eoc",Xc="eog",Zc="eot",Jc="eov",Qc="eop",ef="nk",sf="sob",tf="soc",rf="sog",nf="sot",af="sov",of="sop",cf="st",ff="tf",lf="ts",uf="t",mf="p",gf="ep",hf=[bi,ea],_r=[Ai,Ci,Xn,Yn,ua,Zn,ra,Ms,Jt,Wc,ca,fa,kc,Jn,Qn,Rc],df=[kt],bf=[Ot,Wt,kr,Ht,Vt,Nr],pf=[Si,ia,er,ut,xi,na,aa,yi,oa,sr,at],An={[Kc]:Ot,[qc]:Wt,[ma]:bi,[Uc]:pi,[Yc]:Qt,[Xc]:sa,[Zc]:ta,[Jc]:$i,[Qc]:zt,[gf]:zt,[ef]:la,[sf]:er,[tf]:ut,[rf]:xi,[nf]:yi,[af]:sr,[of]:at,[mf]:at,[cf]:Ci,[ff]:Ht,[lf]:Vt,[uf]:Ai},$f=/^([^:\s]+)(:?\s*(.+))?$/,Sn=/^x_(.+)$/;function En(r){return df.includes(r)}var xf=r=>{if(!r)return r;let s=r.trim();return s in An?An[s]:s},Kt=class r extends Un{static[Symbol.hasInstance](s){return lt(s,Wn)}constructor(s,e=null,a=null,f={},l=null,h=!1){super(a),this._isMetaTag=!1,this._originalName="",this._name="",this._value="",this.selector=null,this.isNegated=!1,this.attributes={},this.parseNameValue(s,e),this.attributes=f,this.selector=l,this.isNegated=h}parseNameValue(s,e){s==="meta"?this.parseMetaTag(e):(this.name=s,this.value=e||"")}parseMetaTag(s){if(!s)throw new Error("Expected value");let[e,a]=s.split(/\s(.+)/);this.name=e,this.value=a||"",this._isMetaTag=!0}static parse(s){return s instanceof r?s:this.parseWithRegex(s,$f)}static parseWithRegex(s,e){let a=s.match(e);return a!==null?new r(a[1],a[3]||null):null}static parseOrFail(s){let e=this.parse(s);if(!e)throw new Error(`Failed to parse ${s}`);return e}get label(){let s=this.attributes.label;return s&&s.length>0?s:this.value||""}isSectionDelimiter(){return this.isSectionStart()||this.isSectionEnd()}isSectionStart(){let[s]=Rr.interpret(this.name,this.value);return s===Js}isSectionEnd(){let[s]=Rr.interpret(this.name,this.value);return s===Qs}isInlineFontTag(){return bf.includes(this.name)}isComment(){return this.name===bi||this.name===ma}isImage(){return this.name===ea}set name(s){this._name=xf(s),this._originalName=s}get name(){return this._name.trim()}get originalName(){return this._originalName.trim()}set value(s){this._value=s||""}get value(){return`${this._value}`.trim()}hasValue(){return this.value.length>0}hasAttributes(){return Object.keys(this.attributes).length>0}hasLabel(){return this.label.length>0}isRenderable(){return hf.includes(this.name)||this.hasRenderableLabel()}hasRenderableLabel(){return(pf.includes(this.name)||this.isSectionStart())&&this.hasLabel()}isMetaTag(){return this._isMetaTag||Sn.test(this.name)||_r.indexOf(this.name)!==-1}isStandardOrCustomMetaTag(){return _r.indexOf(this.name)!==-1||Sn.test(this.name)}clone(){return new r(this._originalName,this.value,null,this.attributes)}toString(){return`Tag(name=${this.name}, value=${this.value})`}set({value:s}){return new r(this._originalName,s,null,this.attributes)}setAttribute(s,e){return new r(this._originalName,this.value,null,{...this.attributes,[s]:e})}};ft(Kt.prototype,Wn);var le=Kt;var Bl={separator:",",order:[..._r,{match:/^x_/,sortMethod:"alphabetical"}]};var zr=class extends Un{},Ei=zr,qt=class r extends Ei{static[Symbol.hasInstance](s){return lt(s,zn)}constructor(s){super(),this.string=s}evaluate(){return this.string}isRenderable(){return!0}clone(){return new r(this.string)}};ft(qt.prototype,zn);var us=qt,Ut=class r{static[Symbol.hasInstance](s){return lt(s,On)}constructor(s=" "){this.content=s}clone(){return new r}};ft(Ut.prototype,On);var Fn=Ut,Or=class r extends Ei{constructor(s,e=null){super(),this.expressions=[],this.expressions=s,this.variable=e}evaluate(s,e){return this.expressions.map(a=>a.evaluate(s,e,this.variable)).join("")}isRenderable(){return!0}clone(){return new r(this.expressions.map(s=>s.clone()),this.variable)}},Ln=Or,Wr=class extends Error{constructor(s,e=null,a=null,f=null){super(`${s} on line ${e} column ${a}`),this.line=null,this.column=null,this.offset=null,this.name="ExpressionError",this.line=e,this.column=a,this.offset=f}},yf=Wr,Hr=class r extends Ei{constructor({variable:s=null,valueTest:e=null,trueExpression:a=[],falseExpression:f=[],line:l=null,column:h=null,offset:S=null}){super({line:l,column:h,offset:S}),this.trueExpression=[],this.falseExpression=[],this.variable=s||null,this.valueTest=e||null,this.trueExpression=a,this.falseExpression=f}evaluate(s,e,a=null){if(this.variable)return this.evaluateWithVariable(s,e);if(!a)throw new yf("Unexpected empty expression",this.line,this.column,this.offset);return this.evaluateToString(s.get(a)||"",e)}evaluateToString(s,e){return Array.isArray(s)?s.join(e):s}evaluateWithVariable(s,e){if(!this.variable)throw new Error("Expected this.variable to be present");let a=s.get(this.variable);return a&&(xc(this.valueTest)||a===this.valueTest)?this.evaluateForTruthyValue(s,e,a):this.falseExpression.length?new Ln(this.falseExpression,this.variable).evaluate(s,e):""}evaluateForTruthyValue(s,e,a){return this.trueExpression.length?new Ln(this.trueExpression,this.variable).evaluate(s,e):this.evaluateToString(a,e)}isRenderable(){return!0}clone(){return new r({variable:this.variable,valueTest:this.valueTest,trueExpression:this.trueExpression.map(s=>s.clone()),falseExpression:this.falseExpression.map(s=>s.clone()),line:this.line,column:this.column,offset:this.offset})}},wn=Hr;var ga={};ga=JSON.parse('{"A":"A base-fret 0 frets x 0 2 2 2 0","A/B":"A/B base-fret 0 frets x 2 2 2 2 0","A/C#":"A/C# base-fret 0 frets x 4 2 2 2 0","A/D":"A/D base-fret 0 frets x x 0 2 2 0","A/E":"A/E base-fret 0 frets 0 0 2 2 2 0","A/F#":"A/F# base-fret 0 frets 2 0 2 2 0 0","A/G":"A/G base-fret 0 frets 3 0 2 2 0 0","A/G#":"A/G# base-fret 0 frets 4 x 2 2 0 0","A11":"A11 base-fret 2 frets 4 3 x 1 2 2","A13":"A13 base-fret 0 frets x 0 2 0 2 2","A13(b9)":"A13(b9) base-fret 3 frets 2 x 2 3 4 3","A2":"A2 base-fret 0 frets x 0 2 2 0 0","A2/C#":"A2/C# base-fret 0 frets x 4 2 2 0 0","A2/E":"A2/E base-fret 0 frets 0 0 2 2 0 0","A2/F#":"A2/F# base-fret 0 frets 2 0 2 2 0 0","A2/G#":"A2/G# base-fret 0 frets 4 x 2 2 0 0","Asus":"Asus base-fret 0 frets x 0 2 2 3 0","Asus/E":"Asus/E base-fret 0 frets 0 0 2 2 3 0","A5":"A5 base-fret 0 frets x 0 2 2 x x","A5/E":"A5/E base-fret 2 frets 0 0 1 1 1 4","A6":"A6 base-fret 0 frets x 0 2 2 2 2","A7":"A7 base-fret 0 frets x 0 2 0 2 0","Aaug7":"Aaug7 base-fret 0 frets x 0 3 2 2 1","A7(#5b9)":"A7(#5b9) base-fret 3 frets 2 x 2 3 3 3","A7(b5)":"A7(b5) base-fret 0 frets x 0 1 0 2 x","A7/E":"A7/E base-fret 0 frets 0 0 2 0 2 0","A7/G":"A7/G base-fret 0 frets 3 x 2 0 2 0","A7(b9)":"A7(b9) base-fret 0 frets x 0 2 3 2 3","A7sus4":"A7sus4 base-fret 0 frets x 0 2 0 3 0","A7sus4/E":"A7sus4/E base-fret 0 frets 0 0 2 0 3 0","A9":"A9 base-fret 0 frets x 0 2 4 0 0","A9(b5)":"A9(b5) base-fret 0 frets x 0 1 4 2 3","Aaug":"Aaug base-fret 0 frets x 0 3 2 2 1","G#9":"G#9 base-fret 0 frets 4 3 4 3 4 x","G#sus":"G#sus base-fret 0 frets 4 4 1 1 2 x","G#ma9":"G#ma9 base-fret 0 frets 4 x 1 3 1 3","Adim":"Adim base-fret 0 frets x 0 1 2 1 2","Adim7":"Adim7 base-fret 0 frets x 0 1 2 1 2","Am":"Am base-fret 0 frets x 0 2 2 1 0","Am/C":"Am/C base-fret 0 frets x 3 2 2 1 0","Am13":"Am13 base-fret 0 frets x 0 0 0 1 2","Am6":"Am6 base-fret 0 frets x 0 2 2 1 2","Am7":"Am7 base-fret 0 frets x 0 2 0 1 0","Am7(b5)":"Am7(b5) base-fret 0 frets x 0 1 0 1 x","Am7/G":"Am7/G base-fret 0 frets 3 x 2 0 1 0","Am9":"Am9 base-fret 0 frets x 0 2 4 1 0","Ama7":"Ama7 base-fret 0 frets x 0 2 1 2 0","Ama9":"Ama9 base-fret 0 frets x 0 2 4 2 4","B":"B base-fret 0 frets x 2 4 4 4 2","B/A":"B/A base-fret 0 frets x 0 4 4 4 2","B/A#":"B/A# base-fret 0 frets x 1 4 3 0 x","B/C#":"B/C# base-fret 0 frets x 4 4 4 4 x","B/D#":"B/D# base-fret 0 frets x x 1 4 4 2","B/E":"B/E base-fret 0 frets 0 2 4 4 0 0","B/F#":"B/F# base-fret 0 frets 2 2 4 4 4 2","B/G#":"B/G# base-fret 0 frets 4 x 4 4 4 x","B11":"B11 base-fret 0 frets x 2 1 2 0 0","B13":"B13 base-fret 0 frets x 2 4 2 4 4","B13(b9)":"B13(b9) base-fret 5 frets 2 x 2 3 4 3","B2":"B2 base-fret 0 frets x 2 4 4 2 2","B2/A#":"B2/A# base-fret 0 frets x 1 4 4 0 x","B2/D#":"B2/D# base-fret 0 frets x 3 1 1 0 x","B2/G#":"B2/G# base-fret 0 frets 4 x 4 4 0 x","Bsus":"Bsus base-fret 0 frets x 2 4 4 0 0","Bsus/F#":"Bsus/F# base-fret 0 frets 2 2 4 4 0 0","B5":"B5 base-fret 0 frets x 2 4 4 0 x","B5/F#":"B5/F# base-fret 0 frets 2 2 4 4 2 2","B6":"B6 base-fret 0 frets x 2 4 4 4 4","B6/9":"B6/9 base-fret 0 frets x 2 1 1 2 x","B7":"B7 base-fret 0 frets x 2 1 2 0 2","Baug7":"Baug7 base-fret 0 frets x 2 1 0 0 3","B7(#5b9)":"B7(#5b9) base-fret 5 frets 2 x 2 3 3 3","B7(#9)":"B7(#9) base-fret 0 frets x 2 1 2 3 x","B7(b5)":"B7(b5) base-fret 0 frets x 2 3 2 4 x","B7(b9)":"B7(b9) base-fret 0 frets x 2 1 2 1 x","B7/A":"B7/A base-fret 0 frets x 0 1 2 0 2","B7/D#":"B7/D# base-fret 0 frets x x 1 2 0 2","B7/F#":"B7/F# base-fret 0 frets 2 2 4 2 4 2","B7sus4":"B7sus4 base-fret 0 frets x 2 2 2 0 2","B7sus4/F#":"B7sus4/F# base-fret 0 frets 2 2 4 4 0 0","B7sus4/G#":"B7sus4/G# base-fret 0 frets 4 x 4 4 0 0","B9":"B9 base-fret 0 frets x 2 1 2 2 2","B9(b5)":"B9(b5) base-fret 0 frets x 2 1 2 2 1","Baug":"Baug base-fret 0 frets x 2 1 0 0 3","A#/D":"A#/D base-fret 0 frets x x 0 3 3 1","A#/F":"A#/F base-fret 0 frets 1 1 3 3 3 1","A#11":"A#11 base-fret 0 frets x 1 0 3 4 4","A#13":"A#13 base-fret 0 frets x 1 3 1 3 3","A#2":"A#2 base-fret 0 frets x 1 3 3 1 1","A#2/F":"A#2/F base-fret 0 frets 1 1 3 3 1 1","A#sus":"A#sus base-fret 0 frets x 1 3 3 4 1","A#7":"A#7 base-fret 0 frets x 1 3 1 3 1","A#aug7":"A#aug7 base-fret 0 frets x 1 4 1 3 x","A#7(#5b9)":"A#7(#5b9) base-fret 5 frets 1 x 1 2 2 2","A#7(#9)":"A#7(#9) base-fret 0 frets x 1 0 1 2 x","A#7(b5)":"A#7(b5) base-fret 0 frets 2 x 2 3 1 x","A#7/F":"A#7/F base-fret 0 frets 1 1 3 1 3 1","A#9":"A#9 base-fret 0 frets x 1 3 3 1 1","A#9(b5)":"A#9(b5) base-fret 0 frets x 1 0 1 1 0","A#m11":"A#m11 base-fret 0 frets 4 x 4 4 2 x","A#m13":"A#m13 base-fret 0 frets x 1 1 1 2 3","A#m6":"A#m6 base-fret 0 frets x x x 3 2 3","A#m7":"A#m7 base-fret 0 frets x 1 3 1 2 1","A#m7(b5)":"A#m7(b5) base-fret 0 frets x 1 2 1 2 0","A#m9":"A#m9 base-fret 0 frets x 4 3 1 1 1","A#ma9":"A#ma9 base-fret 0 frets x 1 0 2 1 x","Bdim":"Bdim base-fret 0 frets x 2 0 1 0 1","Bdim7":"Bdim7 base-fret 0 frets x 2 0 1 0 1","Bm":"Bm base-fret 0 frets x 2 4 4 3 2","Bm/D":"Bm/D base-fret 0 frets x x 0 4 3 2","Bm11":"Bm11 base-fret 0 frets x 2 0 2 2 0","Bm13":"Bm13 base-fret 0 frets x 2 0 1 2 2","Bm6":"Bm6 base-fret 0 frets x 2 0 1 0 2","Bm7":"Bm7 base-fret 0 frets x 2 4 2 3 2","Bm7(b5)":"Bm7(b5) base-fret 0 frets x 2 3 2 3 x","Bm7/A":"Bm7/A base-fret 0 frets x 0 4 2 3 2","Bm9":"Bm9 base-fret 0 frets x 2 x 2 2 2","Bma7":"Bma7 base-fret 0 frets 2 2 4 3 4 2","Bma9":"Bma9 base-fret 0 frets x 2 1 3 2 x","C":"C base-fret 0 frets x 3 2 0 3 3","C#/G#":"C#/G# base-fret 0 frets x x x 1 2 1","C#11":"C#11 base-fret 0 frets x 4 3 4 2 2","C#13":"C#13 base-fret 2 frets x 2 1 2 2 4","C#2":"C#2 base-fret 0 frets x 4 1 1 2 x","C#2/G#":"C#2/G# base-fret 3 frets 1 1 3 3 1 1","C#7":"C#7 base-fret 0 frets x 4 3 4 2 x","C#aug7":"C#aug7 base-fret 0 frets x 4 3 2 0 x","C#7(b5)":"C#7(b5) base-fret 0 frets x 4 3 4 x 3","C#7(b9)":"C#7(b9) base-fret 0 frets x 4 3 4 3 x","C#7/G#":"C#7/G# base-fret 3 frets 1 1 3 1 3 1","C#9":"C#9 base-fret 0 frets x 4 3 4 4 4","C#m7":"C#m7 base-fret 0 frets x 4 2 4 2 4","C#m7(b5)":"C#m7(b5) base-fret 0 frets x 4 2 4 2 3","C#m9":"C#m9 base-fret 0 frets x 4 2 4 4 4","C/A":"C/A base-fret 0 frets x 0 2 0 1 0","C/B":"C/B base-fret 0 frets x 2 x 0 1 3","C/A#":"C/A# base-fret 0 frets x 1 2 0 2 0","C/D":"C/D base-fret 0 frets x x 0 0 1 0","C/E":"C/E base-fret 0 frets 0 3 2 0 1 0","C/F":"C/F base-fret 0 frets x x 3 0 1 0","C/G":"C/G base-fret 0 frets 3 3 2 0 1 0","C11":"C11 base-fret 0 frets x 3 3 3 3 3","C2":"C2 base-fret 0 frets x 3 2 0 3 3","C2/A":"C2/A base-fret 0 frets x 0 2 0 3 3","C2/B":"C2/B base-fret 0 frets x 2 2 0 3 3","C2/E":"C2/E base-fret 0 frets 0 3 2 0 3 3","C2/G":"C2/G base-fret 0 frets 3 3 2 0 3 3","Csus":"Csus base-fret 0 frets x 3 3 2 1 1","C5":"C5 base-fret 0 frets x 3 x 0 1 3","C5/B":"C5/B base-fret 0 frets x 2 x 0 1 3","C5/G":"C5/G base-fret 0 frets 3 3 x 0 1 3","C6":"C6 base-fret 0 frets x 3 2 2 1 0","C7":"C7 base-fret 0 frets 0 3 2 3 1 0","Caug7":"Caug7 base-fret 0 frets x 3 2 1 1 0","C7(b9)":"C7(b9) base-fret 0 frets x 3 2 3 2 x","C7/E":"C7/E base-fret 0 frets 0 3 2 3 1 0","C7/G":"C7/G base-fret 0 frets 3 x 2 3 1 0","C7sus4":"C7sus4 base-fret 0 frets x 3 3 3 1 3","C9":"C9 base-fret 0 frets x 3 2 0 3 0","Caug":"Caug base-fret 0 frets x 3 2 1 1 0","Cdim":"Cdim base-fret 0 frets x x 1 2 1 2","Cdim7":"Cdim7 base-fret 0 frets x 3 4 2 4 x","Cm":"Cm base-fret 0 frets x 3 1 x 1 3","Cm/D#":"Cm/D# base-fret 0 frets x x 1 x 1 3","Cm11":"Cm11 base-fret 0 frets x 3 3 3 4 3","Cm7":"Cm7 base-fret 0 frets x 3 1 3 4 x","Cm9":"Cm9 base-fret 0 frets x 3 1 3 3 3","Cma7":"Cma7 base-fret 0 frets x 3 2 0 0 0","Cma9":"Cma9 base-fret 0 frets x 3 2 4 3 x","D":"D base-fret 0 frets x x 0 2 3 2","D/A":"D/A base-fret 0 frets x 0 0 2 3 2","D/B":"D/B base-fret 0 frets x 2 0 2 3 2","D/C":"D/C base-fret 0 frets x 3 x 2 3 2","D/C#":"D/C# base-fret 0 frets x 4 x 2 3 2","D/E":"D/E base-fret 0 frets x x 2 2 3 2","D/F#":"D/F# base-fret 0 frets 2 0 0 2 3 2","D/G":"D/G base-fret 0 frets 3 x 0 0 3 2","D11":"D11 base-fret 3 frets x 2 2 2 2 2","D13":"D13 base-fret 0 frets x x 0 2 0 2","D2":"D2 base-fret 0 frets x x 0 2 2 0","D2/A":"D2/A base-fret 0 frets x 0 0 2 3 0","D2/B":"D2/B base-fret 0 frets x 2 0 2 3 0","D2/C#":"D2/C# base-fret 0 frets x 4 0 2 3 0","D2/F#":"D2/F# base-fret 0 frets 2 x 0 2 3 0","Dsus":"Dsus base-fret 0 frets x x 0 2 3 3","Dsus/A":"Dsus/A base-fret 0 frets x 0 0 2 3 3","D5":"D5 base-fret 0 frets x x 0 2 3 x","D5/A":"D5/A base-fret 2 frets x 0 0 1 2 4","D5/C#":"D5/C# base-fret 2 frets x x 0 1 1 4","D6":"D6 base-fret 0 frets x x 0 2 0 2","D7":"D7 base-fret 0 frets x x 0 2 1 2","Daug7":"Daug7 base-fret 0 frets x x 0 3 3 2","D7(#9)":"D7(#9) base-fret 3 frets x 2 1 2 3 x","D7(b5)":"D7(b5) base-fret 0 frets x x 0 1 1 2","D7(b9)":"D7(b9) base-fret 2 frets x 4 x 4 3 1","D7/A":"D7/A base-fret 0 frets x 0 0 2 1 2","D7/C":"D7/C base-fret 0 frets x 3 0 2 1 2","D7/F#":"D7/F# base-fret 0 frets 2 0 0 2 1 2","D7sus4":"D7sus4 base-fret 0 frets x x 0 2 1 1","D9":"D9 base-fret 0 frets x x 0 2 2 0","Daug":"Daug base-fret 0 frets x x 0 3 3 2","Ddim":"Ddim base-fret 0 frets x x 0 1 0 1","Ddim7":"Ddim7 base-fret 0 frets x x 0 1 0 1","Dm":"Dm base-fret 0 frets x x 0 2 1 3","Dm/F":"Dm/F base-fret 0 frets x x 3 2 1 3","Dm7":"Dm7 base-fret 0 frets x x 0 2 1 1","Dm7(b5)":"Dm7(b5) base-fret 0 frets x x 0 1 1 1","Dm7/C":"Dm7/C base-fret 0 frets x 3 x 2 1 1","Dma7":"Dma7 base-fret 0 frets x x 0 2 2 2","Dma9":"Dma9 base-fret 2 frets x 4 3 1 1 0","E":"E base-fret 0 frets 0 2 2 1 0 0","E/A":"E/A base-fret 0 frets x 0 2 1 0 0","E/B":"E/B base-fret 0 frets x 2 2 1 0 0","E/C#":"E/C# base-fret 0 frets x 4 2 4 0 0","E/D":"E/D base-fret 0 frets x x 0 1 0 0","E/D#":"E/D# base-fret 0 frets x x 1 1 0 0","E/F#":"E/F# base-fret 0 frets 2 2 2 1 0 x","E/G#":"E/G# base-fret 0 frets 4 x 2 4 0 0","E11":"E11 base-fret 0 frets 0 2 0 2 3 4","E13":"E13 base-fret 0 frets 0 2 0 1 3 0","E2":"E2 base-fret 0 frets 0 2 4 1 0 0","E2/B":"E2/B base-fret 0 frets x 2 4 1 0 0","E2/C#":"E2/C# base-fret 5 frets x 2 4 4 0 0","E2/D#":"E2/D# base-fret 5 frets x 2 4 3 0 0","E2/G#":"E2/G# base-fret 0 frets 4 x 4 4 0 0","Esus":"Esus base-fret 0 frets 0 2 2 2 0 0","Esus/B":"Esus/B base-fret 0 frets x 2 2 2 0 0","E5":"E5 base-fret 0 frets 0 2 4 4 0 0","E5/B":"E5/B base-fret 0 frets x 2 2 4 0 0","E5/D#":"E5/D# base-fret 5 frets x 1 4 3 0 0","E6":"E6 base-fret 0 frets 0 2 2 1 2 0","E7":"E7 base-fret 0 frets 0 2 0 1 0 0","E7(#9)":"E7(#9) base-fret 0 frets 0 2 0 1 3 3","E7(b5)":"E7(b5) base-fret 0 frets 0 1 2 1 3 x","E7(b9)":"E7(b9) base-fret 0 frets 0 x 0 1 0 1","E7/B":"E7/B base-fret 0 frets x 2 0 1 0 0","E7/D":"E7/D base-fret 0 frets x x 0 1 0 0","E7/G#":"E7/G# base-fret 0 frets 4 x 0 4 0 0","E7sus4":"E7sus4 base-fret 0 frets 0 2 0 2 0 0","E9":"E9 base-fret 0 frets 0 2 4 1 0 0","Eaug":"Eaug base-fret 0 frets 0 3 2 1 1 0","Eaug7":"Eaug7 base-fret 0 frets 0 3 2 1 1 0","D#/A#":"D#/A# base-fret 0 frets x x x 3 4 3","D#11":"D#11 base-fret 0 frets x x 1 0 2 4","D#13":"D#13 base-fret 4 frets x 2 1 2 2 4","D#2":"D#2 base-fret 0 frets x x 1 3 4 1","D#2/A#":"D#2/A# base-fret 5 frets 1 1 3 3 1 1","D#7":"D#7 base-fret 0 frets x x 1 3 2 3","D#aug7":"D#aug7 base-fret 0 frets x x 1 4 2 3","D#7(#9)":"D#7(#9) base-fret 0 frets x x 1 0 2 2","D#7(b5)":"D#7(b5) base-fret 0 frets x x 1 2 2 3","D#7(b9)":"D#7(b9) base-fret 0 frets x x 1 0 2 0","D#7/A#":"D#7/A# base-fret 5 frets 2 2 4 2 4 2","D#9":"D#9 base-fret 0 frets x x 1 0 2 1","D#dim7":"D#dim7 base-fret 0 frets x x 1 2 1 2","D#m9":"D#m9 base-fret 3 frets x 3 1 3 3 3","D#ma9":"D#ma9 base-fret 0 frets x x 1 0 3 1","Edim":"Edim base-fret 0 frets 0 1 2 0 2 0","Edim7":"Edim7 base-fret 0 frets 0 1 2 0 2 0","Em":"Em base-fret 0 frets 0 2 2 0 0 0","Em/G":"Em/G base-fret 0 frets 3 2 2 0 3 3","Em7":"Em7 base-fret 0 frets 0 2 2 0 3 0","Em7/D":"Em7/D base-fret 0 frets x x 0 0 3 3","Em9":"Em9 base-fret 0 frets 0 2 4 0 0 0","Ema7":"Ema7 base-fret 0 frets 0 2 1 1 0 0","Ema9":"Ema9 base-fret 0 frets 0 2 4 4 4 4","F":"F base-fret 0 frets x x 3 2 1 1","F#/C#":"F#/C# base-fret 0 frets x 4 4 3 2 2","F#13":"F#13 base-fret 0 frets 2 4 2 3 4 2","F#sus":"F#sus base-fret 0 frets 2 4 4 4 2 2","F#6":"F#6 base-fret 0 frets 2 x 1 3 2 x","F#7":"F#7 base-fret 0 frets 1 4 1 3 1 1","F#7(b5)":"F#7(b5) base-fret 0 frets 2 x 2 3 1 x","F#7/C#":"F#7/C# base-fret 0 frets x 4 2 3 2 2","F#dim7":"F#dim7 base-fret 0 frets 2 3 4 2 4 2","F#m/A":"F#m/A base-fret 0 frets x 0 2 2 0 0","F#m6":"F#m6 base-fret 0 frets 2 x 1 2 2 2","F#m7":"F#m7 base-fret 0 frets 2 x 2 2 0 0","F#m7(b5)":"F#m7(b5) base-fret 0 frets 2 x 2 2 1 0","F#m7/E":"F#m7/E base-fret 0 frets 0 4 4 2 0 0","F#ma9":"F#ma9 base-fret 0 frets 2 1 3 1 2 1","F/A":"F/A base-fret 0 frets x 0 3 2 1 1","F/A#":"F/A# base-fret 0 frets x 1 3 2 1 1","F/C":"F/C base-fret 0 frets x 3 3 2 1 1","F/D":"F/D base-fret 0 frets x x 0 2 1 1","F/E":"F/E base-fret 0 frets x x 2 2 1 1","F/D#":"F/D# base-fret 0 frets x x 1 2 1 1","F/G":"F/G base-fret 0 frets 3 x 3 2 1 1","F13":"F13 base-fret 0 frets 1 3 1 2 3 1","F2":"F2 base-fret 0 frets x x 3 0 1 1","F2/A":"F2/A base-fret 0 frets x 0 3 0 1 1","F2/C":"F2/C base-fret 0 frets x 3 3 0 1 1","F2/D":"F2/D base-fret 0 frets x x 0 0 1 1","F2/E":"F2/E base-fret 0 frets x x 2 0 1 1","Fsus":"Fsus base-fret 0 frets x x 3 3 1 1","F5":"F5 base-fret 0 frets 1 3 3 x 1 1","F6":"F6 base-fret 0 frets x x 3 2 3 1","F7":"F7 base-fret 0 frets 1 3 1 2 1 1","F7(#9)":"F7(#9) base-fret 0 frets x x 3 2 4 4","F7(b9)":"F7(b9) base-fret 0 frets x x 3 2 4 2","F7/A":"F7/A base-fret 0 frets x 0 1 2 1 1","F7/C":"F7/C base-fret 0 frets x 3 1 2 1 1","F7sus4":"F7sus4 base-fret 0 frets 1 3 1 3 1 1","F9":"F9 base-fret 0 frets x x 3 0 1 1","Faug":"Faug base-fret 0 frets x x 3 2 2 1","Faug7":"Faug7 base-fret 0 frets x x 3 2 2 1","Fdim":"Fdim base-fret 0 frets x x 0 1 0 1","Fdim7":"Fdim7 base-fret 0 frets x x 3 4 3 4","Fm":"Fm base-fret 0 frets x x 3 1 1 1","Fm6":"Fm6 base-fret 0 frets 1 x 0 1 1 1","Fm7":"Fm7 base-fret 0 frets 1 3 1 1 1 1","Fm7(b5)":"Fm7(b5) base-fret 0 frets 1 x 1 1 0 x","Fm9":"Fm9 base-fret 0 frets 1 3 1 1 1 3","Fma7":"Fma7 base-fret 0 frets x x 3 2 1 0","G":"G base-fret 0 frets 3 2 0 0 3 3","G#/D#":"G#/D# base-fret 0 frets x x 1 1 1 4","G#11":"G#11 base-fret 0 frets 4 x 4 3 2 x","G#13":"G#13 base-fret 0 frets 4 x 4 3 1 1","G#13(b9)":"G#13(b9) base-fret 3 frets 1 x 1 2 3 2","G#7":"G#7 base-fret 0 frets 4 3 4 1 1 x","G#aug7":"G#aug7 base-fret 0 frets 4 x 3 4 4 4","G#7(#5b9)":"G#7(#5b9) base-fret 3 frets 1 x 1 2 2 2","G#7(#9)":"G#7(#9) base-fret 0 frets 4 x 4 2 4 x","G#7(b5)":"G#7(b5) base-fret 0 frets 4 3 4 x 3 4","G#7/D#":"G#7/D# base-fret 3 frets x 3 1 2 1 1","G#9(b5)":"G#9(b5) base-fret 0 frets 4 x 4 3 3 x","G#m11":"G#m11 base-fret 0 frets 4 x 4 4 2 x","G#m13":"G#m13 base-fret 0 frets 4 2 4 x x 1","G#m6":"G#m6 base-fret 0 frets 4 3 4 3 4 4","G#m7":"G#m7 base-fret 0 frets 4 2 4 4 x 2","G#m7(b5)":"G#m7(b5) base-fret 0 frets 4 x 4 4 3 x","G#m7(b9)":"G#m7(b9) base-fret 2 frets 2 x 1 2 2 4","G#m9":"G#m9 base-fret 0 frets 4 2 4 3 x 2","G/A":"G/A base-fret 0 frets x 0 0 0 3 3","G/B":"G/B base-fret 0 frets x 2 0 0 3 3","G/C":"G/C base-fret 0 frets x 3 0 0 3 3","G/D":"G/D base-fret 0 frets x x 0 0 3 3","G/E":"G/E base-fret 0 frets 0 2 0 0 3 3","G/F":"G/F base-fret 0 frets 1 2 0 0 3 3","G/F#":"G/F# base-fret 0 frets 2 2 0 0 3 3","G11":"G11 base-fret 0 frets 3 x 3 2 1 x","G13":"G13 base-fret 0 frets 3 2 3 0 0 0","G13(b9)":"G13(b9) base-fret 3 frets 1 x 1 2 3 2","G2":"G2 base-fret 0 frets 3 x 0 2 3 3","G2/B":"G2/B base-fret 0 frets x 2 0 2 3 3","G2/D":"G2/D base-fret 0 frets x x 0 2 3 3","G2/E":"G2/E base-fret 0 frets x x 2 2 3 3","G2/F#":"G2/F# base-fret 0 frets 2 x 0 2 3 3","Gsus":"Gsus base-fret 0 frets 3 x 0 0 1 3","Gsus/D":"Gsus/D base-fret 0 frets x x 0 0 1 3","G5":"G5 base-fret 0 frets 3 x 0 0 3 3","G5/D":"G5/D base-fret 0 frets x x 0 0 3 3","G5/F#":"G5/F# base-fret 0 frets 2 x 0 0 3 3","G6":"G6 base-fret 0 frets 3 2 0 0 0 0","G7":"G7 base-fret 0 frets 3 2 3 0 0 3","Gaug7":"Gaug7 base-fret 0 frets 3 x 3 4 2 x","G7(#5b9)":"G7(#5b9) base-fret 0 frets 3 x 3 4 4 4","G7(#9)":"G7(#9) base-fret 0 frets 3 2 3 3 3 x","G7(b5)":"G7(b5) base-fret 0 frets 3 x 3 4 4 x","G7(b9)":"G7(b9) base-fret 0 frets 3 x 3 1 3 x","G7/B":"G7/B base-fret 0 frets x 2 3 0 3 3","G7/D":"G7/D base-fret 0 frets x x 0 0 0 1","G7sus4":"G7sus4 base-fret 0 frets 3 x 0 0 1 1","G9":"G9 base-fret 0 frets 3 x 0 2 3 3","G9(b5)":"G9(b5) base-fret 0 frets 3 x 3 2 2 x","Gaug":"Gaug base-fret 0 frets 3 2 1 0 0 3","F#9":"F#9 base-fret 0 frets 2 4 2 3 2 4","Gdim":"Gdim base-fret 0 frets x 1 2 0 2 0","Gdim7":"Gdim7 base-fret 0 frets x 1 2 0 2 0","Gm11":"Gm11 base-fret 0 frets 3 x 3 3 1 x","Gm6":"Gm6 base-fret 0 frets 3 x 2 3 3 3","Gm7(b5)":"Gm7(b5) base-fret 0 frets 3 x 3 3 2 x","Gma7":"Gma7 base-fret 0 frets 3 x 3 0 0 2","Gma9":"Gma9 base-fret 0 frets 3 x 4 2 3 x","A9(#5)":"A9(#5) base-fret 0 frets x 0 3 4 2 3","A9sus4":"A9sus4 base-fret 0 frets x 0 0 0 0 0","G#":"G# base-fret 0 frets 4 3 1 1 1 x","G#(2)":"G#(2) base-fret 0 frets 4 1 1 3 1 4","G#6":"G#6 base-fret 0 frets 4 3 1 1 1 1","G#6/9":"G#6/9 base-fret 0 frets 4 3 3 3 4 x","G#7(b9)":"G#7(b9) base-fret 0 frets x x 1 2 1 2","G#7sus4":"G#7sus4 base-fret 0 frets x x 1 1 2 2","G#9(#5)":"G#9(#5) base-fret 0 frets 4 3 2 3 x 2","G#9sus4":"G#9sus4 base-fret 0 frets 4 x 4 3 2 2","G#dim7":"G#dim7 base-fret 0 frets x x 0 1 0 1","G#m":"G#m base-fret 0 frets 4 2 1 1 4 x","G#m(ma7)":"G#m(ma7) base-fret 0 frets 4 2 1 1 x 3","G#ma7":"G#ma7 base-fret 0 frets 4 3 1 1 1 3","G#ma7(#11)":"G#ma7(#11) base-fret 3 frets 2 x 3 3 1 x","G#2":"G#2 base-fret 0 frets 4 1 1 1 4 x","Am11":"Am11 base-fret 0 frets x 0 0 0 1 0","Ama7(#11)":"Ama7(#11) base-fret 0 frets x 0 1 1 2 x","B(2)":"B(2) base-fret 0 frets x 2 1 x 2 2","B9(#5)":"B9(#5) base-fret 0 frets x 2 1 2 2 3","B9sus4":"B9sus4 base-fret 0 frets x 2 2 2 2 2","A#(2)":"A#(2) base-fret 0 frets x 1 0 3 1 x","A#5":"A#5 base-fret 0 frets x 1 3 3 x x","A#6":"A#6 base-fret 0 frets x 1 3 3 3 3","A#6/9":"A#6/9 base-fret 0 frets x 1 0 0 1 1","A#7(b9)":"A#7(b9) base-fret 0 frets x 1 0 1 0 1","A#7sus4":"A#7sus4 base-fret 0 frets x 1 3 1 4 1","A#9(#5)":"A#9(#5) base-fret 0 frets x x 0 1 1 2","A#9sus4":"A#9sus4 base-fret 0 frets x 1 1 1 1 1","A#dim7":"A#dim7 base-fret 0 frets x x 2 3 2 3","A#m":"A#m base-fret 0 frets x 1 3 0 2 x","A#m(ma7)":"A#m(ma7) base-fret 0 frets x 1 3 2 2 1","A#ma7":"A#ma7 base-fret 0 frets x 1 3 2 3 1","A#ma7(#11)":"A#ma7(#11) base-fret 0 frets x 1 2 2 3 0","Bm(ma7)":"Bm(ma7) base-fret 0 frets x 2 0 3 3 2","Bma7(#11)":"Bma7(#11) base-fret 0 frets x 2 3 3 4 x","C(2)":"C(2) base-fret 0 frets x 3 2 0 3 0","C#5":"C#5 base-fret 0 frets x x x x 2 4","C13":"C13 base-fret 2 frets x 2 1 2 2 4","C6/9":"C6/9 base-fret 0 frets x 3 2 2 3 x","C7(#9)":"C7(#9) base-fret 0 frets x 3 2 3 4 x","C7(b5)":"C7(b5) base-fret 0 frets x 3 2 3 x 2","C9(#5)":"C9(#5) base-fret 0 frets x 3 2 3 3 4","C9(b5)":"C9(b5) base-fret 0 frets x 3 2 3 3 2","C9sus4":"C9sus4 base-fret 0 frets x 3 3 3 3 3","Cm(ma7)":"Cm(ma7) base-fret 0 frets x 3 1 0 0 3","Cm13":"Cm13 base-fret 3 frets x 1 1 1 2 3","Cm6":"Cm6 base-fret 0 frets x 3 1 2 1 x","Cm7(b5)":"Cm7(b5) base-fret 0 frets x 3 4 3 4 x","Cma7(#11)":"Cma7(#11) base-fret 3 frets x 1 2 2 3 x","D(2)":"D(2) base-fret 2 frets x 4 3 1 4 0","D6/9":"D6/9 base-fret 2 frets x 4 x 3 4 1","D9(#5)":"D9(#5) base-fret 3 frets x 3 2 3 3 4","D9(b5)":"D9(b5) base-fret 3 frets x 3 2 3 3 2","D9sus4":"D9sus4 base-fret 0 frets x x 0 0 1 0","C#":"C# base-fret 0 frets x 4 3 1 2 1","C#(2)":"C#(2) base-fret 0 frets x 4 3 1 4 x","C#6":"C#6 base-fret 0 frets x 4 3 3 2 x","C#6/9":"C#6/9 base-fret 0 frets x 4 3 3 4 4","C#7(#9)":"C#7(#9) base-fret 0 frets x 4 3 4 0 0","C#7sus4":"C#7sus4 base-fret 0 frets x 4 4 4 2 x","C#9(#5)":"C#9(#5) base-fret 3 frets x 2 1 2 2 3","C#9(b5)":"C#9(b5) base-fret 0 frets x 4 3 4 4 3","C#9sus4":"C#9sus4 base-fret 0 frets x 4 4 4 4 4","C#dim7":"C#dim7 base-fret 0 frets x x 2 3 2 3","C#m":"C#m base-fret 0 frets x 4 2 x 2 4","C#m(ma7)":"C#m(ma7) base-fret 0 frets x 4 2 1 1 4","C#m11":"C#m11 base-fret 0 frets x 4 2 4 4 2","C#m13":"C#m13 base-fret 3 frets x 2 2 2 3 4","C#m6":"C#m6 base-fret 0 frets x 4 2 3 2 x","C#ma7":"C#ma7 base-fret 0 frets x 4 3 1 1 1","C#ma7(#11)":"C#ma7(#11) base-fret 3 frets x 2 3 3 4 x","C#ma9":"C#ma9 base-fret 3 frets x 2 1 4 3 x","C#sus":"C#sus base-fret 0 frets x 4 4 1 2 x","Dm9":"Dm9 base-fret 2 frets x 4 2 1 4 0","Dm(ma7)":"Dm(ma7) base-fret 0 frets x x 0 2 2 1","Dm11":"Dm11 base-fret 3 frets x 3 1 3 3 1","Dm13":"Dm13 base-fret 5 frets x 1 1 1 2 3","Dm6":"Dm6 base-fret 0 frets x x 0 2 0 1","Dma7(#11)":"Dma7(#11) base-fret 5 frets x 1 2 2 3 x","E(2)":"E(2) base-fret 0 frets 0 2 2 1 0 2","E6/9":"E6/9 base-fret 0 frets 0 x 2 1 2 2","E9(#5)":"E9(#5) base-fret 0 frets 0 x 0 1 1 2","E9(b5)":"E9(b5) base-fret 0 frets 0 1 2 1 3 2","E9sus4":"E9sus4 base-fret 0 frets 0 2 0 2 0 2","D#":"D# base-fret 0 frets x x 1 3 4 3","D#aug":"D#aug base-fret 0 frets x x 1 0 0 x","D#(2)":"D#(2) base-fret 3 frets x 4 3 1 4 x","D#(b5)":"D#(b5) base-fret 5 frets x 2 1 2 2 1","D#5":"D#5 base-fret 0 frets x x 1 3 4 x","D#6":"D#6 base-fret 0 frets x x 1 3 1 3","D#6/9":"D#6/9 base-fret 0 frets x x 1 0 1 1","D#7sus4":"D#7sus4 base-fret 0 frets x x 1 1 2 4","D#9sus4":"D#9sus4 base-fret 0 frets x x 1 1 2 1","D#m":"D#m base-fret 0 frets x x 1 3 4 2","D#m(ma7)":"D#m(ma7) base-fret 0 frets x x 1 3 3 2","D#m11":"D#m11 base-fret 3 frets x 4 2 4 4 2","D#m13":"D#m13 base-fret 5 frets x 2 2 2 3 4","D#m7":"D#m7 base-fret 0 frets x x 1 3 2 2","D#m7(b5)":"D#m7(b5) base-fret 0 frets x x 1 2 2 2","D#ma7":"D#ma7 base-fret 0 frets x x 1 3 3 3","D#ma7(#11)":"D#ma7(#11) base-fret 5 frets x 2 3 3 4 x","D#sus":"D#sus base-fret 0 frets x 1 1 3 4 4","Em(ma7)":"Em(ma7) base-fret 0 frets 0 2 1 0 0 0","Em11":"Em11 base-fret 0 frets 0 2 0 2 0 3","Em13":"Em13 base-fret 0 frets 0 4 4 0 2 0","Em6":"Em6 base-fret 0 frets 0 2 2 0 2 0","Em7(b5)":"Em7(b5) base-fret 0 frets 0 x 2 3 3 3","Ema7(#11)":"Ema7(#11) base-fret 0 frets 0 x 2 3 4 4","F(2)":"F(2) base-fret 0 frets x x 3 2 1 3","F#":"F# base-fret 0 frets 3 x 2 4 3 x","F#(2)":"F#(2) base-fret 0 frets 2 x 4 3 2 4","F#5":"F#5 base-fret 0 frets 2 4 4 x x x","F#6/9":"F#6/9 base-fret 0 frets 2 1 1 1 2 x","F#aug7":"F#aug7 base-fret 0 frets 2 x 2 3 3 x","F#7(#9)":"F#7(#9) base-fret 0 frets 2 1 2 2 x x","F#7(b9)":"F#7(b9) base-fret 0 frets x x 2 3 2 3","F#7sus4":"F#7sus4 base-fret 0 frets 1 4 2 4 2 2","F#9(#5)":"F#9(#5) base-fret 0 frets 2 1 2 1 3 x","F#9(b5)":"F#9(b5) base-fret 0 frets 2 1 2 1 3 x","F#9sus4":"F#9sus4 base-fret 0 frets 2 4 2 4 2 4","F#m":"F#m base-fret 0 frets 2 4 4 2 2 2","F#m9":"F#m9 base-fret 0 frets 2 4 4 2 2 4","F#m(ma7)":"F#m(ma7) base-fret 0 frets 2 4 3 2 2 x","F#m11":"F#m11 base-fret 0 frets 2 x 2 2 0 0","F#m13":"F#m13 base-fret 0 frets 1 3 1 1 3 1","F#ma7":"F#ma7 base-fret 0 frets 2 x 3 3 2 x","F#ma7(#11)":"F#ma7(#11) base-fret 0 frets 2 x 3 3 1 x","F#2":"F#2 base-fret 0 frets 2 4 4 x 2 4","F6/9":"F6/9 base-fret 0 frets 1 0 0 0 1 1","F7(b5)":"F7(b5) base-fret 0 frets 1 0 1 2 0 x","F9(#5)":"F9(#5) base-fret 0 frets 1 0 1 0 2 x","F9(b5)":"F9(b5) base-fret 0 frets 1 0 1 0 0 x","F9sus4":"F9sus4 base-fret 0 frets 1 3 1 3 1 3","Fm(ma7)":"Fm(ma7) base-fret 0 frets 1 x x 1 1 0","Fm11":"Fm11 base-fret 0 frets 1 3 1 3 1 4","Fm13":"Fm13 base-fret 0 frets 1 3 1 1 3 1","Fma7(#11)":"Fma7(#11) base-fret 0 frets 1 x 2 2 0 0","Fma9":"Fma9 base-fret 0 frets 1 0 2 0 1 0","G(2)":"G(2) base-fret 0 frets 3 x 0 2 0 3","G#5":"G#5 base-fret 0 frets 4 x 1 1 4 x","G6/9":"G6/9 base-fret 0 frets 3 2 2 2 3 0","G9(#5)":"G9(#5) base-fret 0 frets 3 2 3 2 4 x","G9sus4":"G9sus4 base-fret 0 frets 3 x 3 2 1 1","Gm":"Gm base-fret 0 frets 3 x 0 3 3 3","Gm9":"Gm9 base-fret 0 frets 3 1 3 2 x 1","Gm(ma7)":"Gm(ma7) base-fret 0 frets 3 x 0 3 3 2","Gm13":"Gm13 base-fret 0 frets 3 x 3 3 1 0","Gm7":"Gm7 base-fret 0 frets 3 x 3 3 3 x","Gma7(#11)":"Gma7(#11) base-fret 0 frets 3 x 4 4 2 x","A(2)":"A(2) base-fret 0 frets x 0 2 4 2 0","A(4)":"A(4) base-fret 0 frets x 0 0 2 2 0","Am2":"Am2 base-fret 0 frets x 0 2 4 1 0","A6/9":"A6/9 base-fret 0 frets x 0 2 4 2 2","A13sus4":"A13sus4 base-fret 0 frets x 0 0 0 0 2","Am(ma7)":"Am(ma7) base-fret 0 frets x x x 2 1 4","Am(ma9)":"Am(ma9) base-fret 2 frets x 0 1 4 0 3","A7(#9)":"A7(#9) base-fret 2 frets 4 x 1 4 1 2","Am7(#5)":"Am7(#5) base-fret 0 frets x 0 3 2 1 3","Ama7(#5)":"Ama7(#5) base-fret 0 frets x 0 3 1 2 1","Ama7(b5)":"Ama7(b5) base-fret 0 frets x 0 1 2 2 4","A/A#":"A/A# base-fret 0 frets x 1 2 2 2 x","A/C":"A/C base-fret 0 frets x 3 2 2 2 x","A/D#":"A/D# base-fret 0 frets x x 1 2 2 0","A/F":"A/F base-fret 0 frets 1 4 2 2 x x","Am/A#":"Am/A# base-fret 0 frets x 1 2 2 1 x","Am/B":"Am/B base-fret 0 frets x 2 2 2 1 x","Am/C#":"Am/C# base-fret 0 frets x 4 2 2 1 x","Am/D":"Am/D base-fret 0 frets x x 0 2 1 0","Am/D#":"Am/D# base-fret 0 frets x x 1 2 1 0","Am/E":"Am/E base-fret 0 frets x x 2 2 1 x","Am/F":"Am/F base-fret 0 frets 1 3 2 2 x x","Am/F#":"Am/F# base-fret 0 frets 2 3 2 2 x x","Am/G":"Am/G base-fret 0 frets 3 3 2 2 x x","Am/G#":"Am/G# base-fret 0 frets 4 3 2 2 x x","A#":"A# base-fret 0 frets x 1 3 3 3 1","A#(4)":"A#(4) base-fret 0 frets x 1 1 3 3 1","A#m2":"A#m2 base-fret 3 frets 4 1 1 4 4 x","A#aug":"A#aug base-fret 0 frets x x x 3 3 2","A#dim":"A#dim base-fret 0 frets x 1 2 3 2 x","A#13sus4":"A#13sus4 base-fret 0 frets x 1 1 1 4 3","A#m(ma9)":"A#m(ma9) base-fret 3 frets 4 2 x 3 4 3","A#m7(#5)":"A#m7(#5) base-fret 0 frets x 1 4 1 2 x","A#ma7(#5)":"A#ma7(#5) base-fret 0 frets x 1 4 2 3 2","A#ma7(b5)":"A#ma7(b5) base-fret 0 frets x 1 2 2 3 x","A#/A":"A#/A base-fret 0 frets x 0 0 3 3 1","A#/B":"A#/B base-fret 0 frets x 2 3 3 3 x","A#/C":"A#/C base-fret 0 frets x 3 3 3 3 x","A#/C#":"A#/C# base-fret 0 frets x 4 3 3 3 x","A#/D#":"A#/D# base-fret 0 frets x x 1 3 3 1","A#/E":"A#/E base-fret 0 frets 0 1 3 x 3 1","A#/F#":"A#/F# base-fret 0 frets 2 1 3 x 3 1","A#/G":"A#/G base-fret 0 frets 3 1 3 x 3 1","A#/G#":"A#/G# base-fret 0 frets 4 1 3 x 3 1","A#m/A":"A#m/A base-fret 0 frets x 0 3 3 2 1","A#m/B":"A#m/B base-fret 0 frets x 2 3 3 2 x","A#m/C":"A#m/C base-fret 0 frets x 3 3 3 2 x","A#m/C#":"A#m/C# base-fret 0 frets x 4 3 3 x x","A#m/D":"A#m/D base-fret 0 frets x x 0 3 2 1","A#m/D#":"A#m/D# base-fret 0 frets x x 1 3 2 1","A#m/E":"A#m/E base-fret 0 frets 0 1 3 3 2 1","A#m/F":"A#m/F base-fret 0 frets 1 1 3 3 2 1","A#m/F#":"A#m/F# base-fret 0 frets 2 1 x 3 2 1","A#m/G":"A#m/G base-fret 0 frets 3 1 3 x 2 1","A#m/G#":"A#m/G# base-fret 0 frets 4 1 3 x 2 1","B(4)":"B(4) base-fret 0 frets x 2 2 4 4 2","Bm2":"Bm2 base-fret 0 frets x 2 0 x 2 2","B13sus4":"B13sus4 base-fret 0 frets x 2 2 2 0 4","Bm(ma9)":"Bm(ma9) base-fret 0 frets x 2 0 3 2 x","Bm7(#5)":"Bm7(#5) base-fret 0 frets x 2 x 2 3 3","Bma7(#5)":"Bma7(#5) base-fret 0 frets x 2 1 3 4 3","Bma7(b5)":"Bma7(b5) base-fret 0 frets x 2 1 3 4 1","B/C":"B/C base-fret 0 frets x 3 4 4 4 x","B/D":"B/D base-fret 0 frets x x 0 4 4 2","B/F":"B/F base-fret 0 frets 1 2 1 x 4 2","B/G":"B/G base-fret 0 frets 3 2 4 x 4 2","Bm/A":"Bm/A base-fret 0 frets x 0 0 4 3 2","Bm/A#":"Bm/A# base-fret 0 frets x 1 x 4 3 2","Bm/C":"Bm/C base-fret 0 frets x 3 4 4 3 x","Bm/C#":"Bm/C# base-fret 0 frets x 4 4 4 3 x","Bm/D#":"Bm/D# base-fret 0 frets x x 1 4 3 2","Bm/E":"Bm/E base-fret 0 frets 0 2 0 4 3 2","Bm/F":"Bm/F base-fret 0 frets x x 3 4 3 2","Bm/F#":"Bm/F# base-fret 0 frets 2 2 4 4 3 2","Bm/G":"Bm/G base-fret 0 frets 3 2 x 4 3 2","Bm/G#":"Bm/G# base-fret 0 frets 4 2 4 x 3 2","C(4)":"C(4) base-fret 0 frets x 3 2 0 1 1","Cm2":"Cm2 base-fret 0 frets x 3 1 x 3 3","C13sus4":"C13sus4 base-fret 3 frets x 1 1 1 4 3","Cm(ma9)":"Cm(ma9) base-fret 0 frets x 3 1 4 3 3","Cm7(#5)":"Cm7(#5) base-fret 0 frets x 3 1 3 1 4","Cma7(#5)":"Cma7(#5) base-fret 0 frets x 3 2 4 x 4","Cma7(b5)":"Cma7(b5) base-fret 0 frets x 3 2 4 x 2","C/C#":"C/C# base-fret 0 frets x 4 2 x 1 3","C/D#":"C/D# base-fret 0 frets x x 1 0 1 0","C/F#":"C/F# base-fret 0 frets 2 3 2 x x 3","C/G#":"C/G# base-fret 0 frets 4 3 2 0 x 0","Cm/A":"Cm/A base-fret 0 frets x 0 1 0 1 3","Cm/A#":"Cm/A# base-fret 0 frets x 1 1 x 1 3","Cm/B":"Cm/B base-fret 0 frets x 2 1 x 1 3","Cm/C#":"Cm/C# base-fret 0 frets x 4 1 0 1 x","Cm/D":"Cm/D base-fret 3 frets x 3 3 3 2 x","Cm/E":"Cm/E base-fret 0 frets 0 3 1 0 1 x","Cm/F":"Cm/F base-fret 0 frets 1 3 1 0 x x","Cm/F#":"Cm/F# base-fret 0 frets 2 3 1 x x 3","Cm/G":"Cm/G base-fret 0 frets 3 3 1 x x x","Cm/G#":"Cm/G# base-fret 0 frets 4 3 x x 4 3","C#(4)":"C#(4) base-fret 0 frets x 4 4 1 2 1","C#m2":"C#m2 base-fret 0 frets x 4 2 1 4 4","C#aug":"C#aug base-fret 0 frets x 4 3 2 2 x","C#dim":"C#dim base-fret 0 frets x 4 2 x 2 3","C#13sus4":"C#13sus4 base-fret 3 frets x 2 2 2 0 4","C#m(ma9)":"C#m(ma9) base-fret 2 frets x 3 1 4 3 3","C#m7(#5)":"C#m7(#5) base-fret 0 frets x 4 2 2 0 0","C#ma7(#5)":"C#ma7(#5) base-fret 0 frets x 4 3 2 1 1","C#ma7(b5)":"C#ma7(b5) base-fret 0 frets x 4 3 x 1 3","C#/A":"C#/A base-fret 0 frets x 0 3 1 2 1","C#/A#":"C#/A# base-fret 0 frets x 1 3 1 2 1","C#/B":"C#/B base-fret 0 frets x 2 3 1 2 1","C#/C":"C#/C base-fret 0 frets x 3 3 1 2 1","C#/D":"C#/D base-fret 0 frets x x 0 1 2 1","C#/D#":"C#/D# base-fret 0 frets x x 1 1 2 1","C#/E":"C#/E base-fret 0 frets 0 4 3 1 2 1","C#/F":"C#/F base-fret 0 frets x x 3 1 2 1","C#/F#":"C#/F# base-fret 0 frets x x 4 1 2 1","C#/G":"C#/G base-fret 0 frets 3 x 3 1 2 1","C#m/A":"C#m/A base-fret 0 frets x 0 2 1 2 0","C#m/A#":"C#m/A# base-fret 0 frets x 1 2 1 2 x","C#m/B":"C#m/B base-fret 0 frets x 2 2 1 2 x","C#m/C":"C#m/C base-fret 0 frets x 3 2 1 2 x","C#m/D":"C#m/D base-fret 0 frets x x 0 1 2 0","C#m/D#":"C#m/D# base-fret 0 frets x x 1 1 2 0","C#m/E":"C#m/E base-fret 0 frets x x 2 1 2 x","C#m/F":"C#m/F base-fret 0 frets 1 x 2 1 2 4","C#m/F#":"C#m/F# base-fret 0 frets 2 x 2 1 2 x","C#m/G":"C#m/G base-fret 0 frets 3 4 2 1 x x","C#m/G#":"C#m/G# base-fret 0 frets 4 4 2 x x x","D(4)":"D(4) base-fret 2 frets x 4 4 1 2 1","Dm2":"Dm2 base-fret 2 frets x 4 2 1 4 4","D13sus4":"D13sus4 base-fret 5 frets x 1 1 1 4 3","Dm(ma9)":"Dm(ma9) base-fret 2 frets x 4 2 x 1 0","Dm7(#5)":"Dm7(#5) base-fret 0 frets x x 0 3 1 1","Dma7(#5)":"Dma7(#5) base-fret 0 frets x x 0 3 2 2","Dma7(b5)":"Dma7(b5) base-fret 0 frets x x 0 1 2 2","D/A#":"D/A# base-fret 0 frets x 1 4 2 3 2","D/D#":"D/D# base-fret 0 frets x x 1 2 3 2","D/F":"D/F base-fret 0 frets x x 3 2 3 2","D/G#":"D/G# base-fret 0 frets 4 x 4 2 3 2","Dm/A":"Dm/A base-fret 0 frets x x x 2 3 1","Dm/A#":"Dm/A# base-fret 0 frets x 1 3 2 3 1","Dm/B":"Dm/B base-fret 0 frets x 2 3 2 3 x","Dm/C":"Dm/C base-fret 0 frets x 3 3 2 3 x","Dm/C#":"Dm/C# base-fret 0 frets x 4 3 2 3 x","Dm/D#":"Dm/D# base-fret 0 frets x x 1 2 3 1","Dm/E":"Dm/E base-fret 0 frets 0 0 0 2 3 1","Dm/F#":"Dm/F# base-fret 0 frets 2 x 3 2 3 x","Dm/G":"Dm/G base-fret 0 frets 3 x 3 2 3 x","Dm/G#":"Dm/G# base-fret 0 frets 4 x 3 2 3 x","D#(4)":"D#(4) base-fret 3 frets x 4 4 1 2 1","D#m2":"D#m2 base-fret 3 frets x 4 2 1 4 4","D#dim":"D#dim base-fret 0 frets x x 1 2 4 2","D#m6":"D#m6 base-fret 0 frets x x 1 3 1 2","D#13sus4":"D#13sus4 base-fret 6 frets x 1 1 1 4 3","D#m(ma9)":"D#m(ma9) base-fret 4 frets x 3 1 4 3 x","D#m7(#5)":"D#m7(#5) base-fret 0 frets x x 1 4 2 2","D#ma7(#5)":"D#ma7(#5) base-fret 0 frets x x 1 4 3 3","D#ma7(b5)":"D#ma7(b5) base-fret 0 frets x x 1 2 3 3","D#9(#5)":"D#9(#5) base-fret 5 frets x 2 1 2 2 3","D#9(b5)":"D#9(b5) base-fret 5 frets x 2 1 2 2 1","D#/A":"D#/A base-fret 0 frets x 0 1 3 4 3","D#/B":"D#/B base-fret 0 frets x 2 1 3 4 3","D#/C":"D#/C base-fret 0 frets x 3 1 3 4 3","D#/C#":"D#/C# base-fret 0 frets x 4 x 3 4 3","D#/D":"D#/D base-fret 0 frets x x 0 3 4 3","D#/E":"D#/E base-fret 0 frets 0 x 1 3 4 3","D#/F":"D#/F base-fret 0 frets 1 1 1 3 4 3","D#/F#":"D#/F# base-fret 0 frets x x 4 3 4 3","D#/G":"D#/G base-fret 0 frets 3 1 1 3 4 x","D#/G#":"D#/G# base-fret 0 frets 4 x x 3 4 3","D#m/A":"D#m/A base-fret 0 frets x 0 4 3 4 2","D#m/A#":"D#m/A# base-fret 0 frets x 1 1 3 4 2","D#m/B":"D#m/B base-fret 0 frets x 2 4 3 4 2","D#m/C":"D#m/C base-fret 0 frets x 3 4 3 4 x","D#m/C#":"D#m/C# base-fret 0 frets x 4 4 3 4 x","D#m/D":"D#m/D base-fret 0 frets x x 0 3 4 2","D#m/E":"D#m/E base-fret 0 frets 0 x 4 3 4 2","D#m/F":"D#m/F base-fret 0 frets 1 1 1 3 4 2","D#m/F#":"D#m/F# base-fret 0 frets 2 x 4 3 4 2","D#m/G":"D#m/G base-fret 0 frets 3 1 1 3 x 2","D#m/G#":"D#m/G# base-fret 0 frets 4 1 1 3 x 2","E(4)":"E(4) base-fret 0 frets 0 0 2 1 0 0","Em2":"Em2 base-fret 0 frets 0 2 4 0 0 0","E13sus4":"E13sus4 base-fret 0 frets 0 0 0 2 2 2","Em(ma9)":"Em(ma9) base-fret 0 frets 0 2 1 0 0 2","Em7(#5)":"Em7(#5) base-fret 0 frets 0 3 0 0 3 0","Ema7(#5)":"Ema7(#5) base-fret 0 frets 0 3 2 1 4 0","Ema7(b5)":"Ema7(b5) base-fret 0 frets x x 2 3 4 4","E/A#":"E/A# base-fret 0 frets x 1 2 4 x 4","E/C":"E/C base-fret 0 frets x 3 2 4 x 4","E/F":"E/F base-fret 0 frets 1 2 2 1 x 4","E/G":"E/G base-fret 0 frets 3 2 2 4 x 4","Em/A":"Em/A base-fret 0 frets x 0 2 0 0 0","Em/A#":"Em/A# base-fret 0 frets x 1 2 4 x 3","Em/B":"Em/B base-fret 0 frets x 2 2 4 x 3","Em/C":"Em/C base-fret 0 frets x 3 2 4 x 3","Em/C#":"Em/C# base-fret 0 frets x 4 2 4 x 3","Em/D":"Em/D base-fret 0 frets x x 0 0 0 0","Em/D#":"Em/D# base-fret 0 frets x x 1 0 0 0","Em/F":"Em/F base-fret 0 frets 1 2 2 4 x 3","Em/F#":"Em/F# base-fret 0 frets x x 4 0 0 0","Em/G#":"Em/G# base-fret 0 frets 4 2 2 4 x 3","F(4)":"F(4) base-fret 0 frets 1 1 3 2 1 1","Fm2":"Fm2 base-fret 0 frets x x 3 1 1 3","F11":"F11 base-fret 0 frets 1 0 1 3 x x","F13sus4":"F13sus4 base-fret 0 frets 1 3 1 3 3 1","Fm(ma9)":"Fm(ma9) base-fret 0 frets 1 3 2 1 1 3","Fm7(#5)":"Fm7(#5) base-fret 0 frets 1 4 1 1 4 1","Fma7(#5)":"Fma7(#5) base-fret 0 frets 1 x 2 2 2 1","Fma7(b5)":"Fma7(b5) base-fret 0 frets 1 2 2 2 x 1","F/B":"F/B base-fret 0 frets x 2 3 2 1 1","F/C#":"F/C# base-fret 0 frets x 4 3 2 1 1","F/F#":"F/F# base-fret 0 frets 2 x 3 2 1 1","F/G#":"F/G# base-fret 0 frets 4 3 x 2 1 1","Fm/A":"Fm/A base-fret 0 frets x 0 3 1 1 1","Fm/A#":"Fm/A# base-fret 0 frets x 1 3 1 1 1","Fm/B":"Fm/B base-fret 0 frets x 2 3 1 1 1","Fm/C":"Fm/C base-fret 0 frets x 3 3 1 1 1","Fm/C#":"Fm/C# base-fret 0 frets x 4 3 1 1 1","Fm/D":"Fm/D base-fret 0 frets x x 0 1 1 1","Fm/D#":"Fm/D# base-fret 0 frets x x 1 1 1 1","Fm/E":"Fm/E base-fret 0 frets 0 3 3 1 1 1","Fm/F#":"Fm/F# base-fret 0 frets 2 3 3 1 1 1","Fm/G":"Fm/G base-fret 0 frets 3 3 3 1 1 1","Fm/G#":"Fm/G# base-fret 0 frets x x x 1 1 1","F#(4)":"F#(4) base-fret 0 frets 2 2 4 3 2 2","F#m2":"F#m2 base-fret 0 frets x x 4 2 2 4","F#aug":"F#aug base-fret 0 frets 2 x 4 3 3 2","F#dim":"F#dim base-fret 0 frets 2 3 4 2 x x","F#11":"F#11 base-fret 0 frets 2 1 2 4 x x","F#13sus4":"F#13sus4 base-fret 0 frets 2 4 2 4 4 2","F#m(ma9)":"F#m(ma9) base-fret 0 frets 2 4 3 2 2 4","F#m7(#5)":"F#m7(#5) base-fret 0 frets 2 x 2 2 3 2","F#ma7(#5)":"F#ma7(#5) base-fret 0 frets 2 x 3 3 3 2","F#ma7(b5)":"F#ma7(b5) base-fret 0 frets 2 1 3 3 1 1","F#/A":"F#/A base-fret 0 frets x 0 4 3 2 2","F#/A#":"F#/A# base-fret 0 frets x x x 3 2 2","F#/B":"F#/B base-fret 0 frets x 2 4 3 2 2","F#/C":"F#/C base-fret 0 frets x 3 4 3 2 2","F#/D":"F#/D base-fret 0 frets x x 0 3 2 2","F#/D#":"F#/D# base-fret 0 frets x x 1 3 2 2","F#/E":"F#/E base-fret 0 frets 0 4 4 3 2 2","F#/F":"F#/F base-fret 0 frets x x 3 3 2 2","F#/G":"F#/G base-fret 0 frets 3 x 4 3 2 2","F#/G#":"F#/G# base-fret 0 frets 4 x 4 3 2 2","F#m/A#":"F#m/A# base-fret 0 frets x 1 4 2 2 2","F#m/B":"F#m/B base-fret 0 frets x 2 4 2 2 2","F#m/C":"F#m/C base-fret 0 frets x 3 4 2 2 2","F#m/C#":"F#m/C# base-fret 0 frets x 4 4 2 2 2","F#m/D":"F#m/D base-fret 0 frets x x 0 2 2 2","F#m/D#":"F#m/D# base-fret 0 frets x x 1 2 2 2","F#m/E":"F#m/E base-fret 0 frets 0 0 4 2 2 2","F#m/F":"F#m/F base-fret 0 frets x x 3 2 2 2","F#m/G":"F#m/G base-fret 0 frets 3 4 4 2 2 2","F#m/G#":"F#m/G# base-fret 0 frets 4 4 4 2 2 2","G(4)":"G(4) base-fret 0 frets 3 3 x 4 3 3","Gm2":"Gm2 base-fret 0 frets 3 1 x 2 3 x","G13sus4":"G13sus4 base-fret 0 frets 3 3 3 0 3 0","Gm(ma9)":"Gm(ma9) base-fret 0 frets 3 1 4 2 x x","Gm7(#5)":"Gm7(#5) base-fret 0 frets 3 1 1 3 4 1","Gma7(#5)":"Gma7(#5) base-fret 0 frets 3 2 4 x 4 2","Gma7(b5)":"Gma7(b5) base-fret 0 frets 3 2 4 4 2 2","G/A#":"G/A# base-fret 0 frets x 1 x 4 3 3","G/C#":"G/C# base-fret 0 frets x 4 x 4 3 3","G/D#":"G/D# base-fret 0 frets x x 1 4 3 3","G/G#":"G/G# base-fret 0 frets 4 x x 4 3 3","Gm/A":"Gm/A base-fret 0 frets x 0 0 3 3 3","Gm/A#":"Gm/A# base-fret 0 frets x x x 3 3 3","Gm/B":"Gm/B base-fret 0 frets x 2 x 3 3 3","Gm/C":"Gm/C base-fret 0 frets x 3 x 3 3 3","Gm/C#":"Gm/C# base-fret 0 frets x 4 x 3 3 3","Gm/D":"Gm/D base-fret 0 frets x x 0 3 3 3","Gm/D#":"Gm/D# base-fret 0 frets x x 1 3 3 3","Gm/E":"Gm/E base-fret 0 frets 0 1 0 0 x x","Gm/F":"Gm/F base-fret 0 frets x x 3 3 3 3","Gm/F#":"Gm/F# base-fret 0 frets x x 4 3 3 3","Gm/G#":"Gm/G# base-fret 0 frets 4 x x 3 3 3","G#(4)":"G#(4) base-fret 0 frets 4 3 1 1 2 x","G#m2":"G#m2 base-fret 0 frets 4 1 1 4 4 x","G#aug":"G#aug base-fret 0 frets 4 x 2 1 1 4","G#dim":"G#dim base-fret 0 frets 4 2 x 4 3 x","G#13sus4":"G#13sus4 base-fret 0 frets 4 x 4 1 2 1","G#m(ma9)":"G#m(ma9) base-fret 0 frets 4 2 x 3 4 3","G#m7(#5)":"G#m7(#5) base-fret 0 frets 4 2 2 4 x 2","G#ma7(#5)":"G#ma7(#5) base-fret 0 frets 4 x 2 1 1 3","G#ma7(b5)":"G#ma7(b5) base-fret 0 frets 4 3 x 1 3 3","G#/A":"G#/A base-fret 0 frets x 0 1 1 1 x","G#/A#":"G#/A# base-fret 0 frets x 1 1 1 1 4","G#/B":"G#/B base-fret 0 frets x 2 1 1 1 4","G#/C":"G#/C base-fret 0 frets x 3 1 1 4 x","G#/C#":"G#/C# base-fret 0 frets x 4 1 1 1 4","G#/D":"G#/D base-fret 3 frets x 3 4 3 2 2","G#/E":"G#/E base-fret 0 frets 0 3 1 1 x x","G#/F":"G#/F base-fret 0 frets 1 3 1 1 1 4","G#/F#":"G#/F# base-fret 0 frets 2 3 1 1 4 x","G#/G":"G#/G base-fret 0 frets 3 3 1 1 4 x","G#m/A":"G#m/A base-fret 0 frets x 0 1 4 4 4","G#m/A#":"G#m/A# base-fret 0 frets x 1 1 4 4 4","G#m/B":"G#m/B base-fret 0 frets x x x 4 4 4","G#m/C":"G#m/C base-fret 0 frets x 3 1 4 4 4","G#m/C#":"G#m/C# base-fret 0 frets x 4 x 4 4 4","G#m/D":"G#m/D base-fret 0 frets x x 0 4 4 4","G#m/D#":"G#m/D# base-fret 0 frets x x 1 4 4 4","G#m/E":"G#m/E base-fret 0 frets 0 2 1 1 0 x","G#m/F":"G#m/F base-fret 0 frets 1 2 1 1 4 x","G#m/F#":"G#m/F# base-fret 0 frets x x 4 4 4 4","G#m/G":"G#m/G base-fret 0 frets 3 2 1 1 4 x","Am(4)":"Am(4) base-fret 0 frets x 0 0 2 1 0","Am6/9":"Am6/9 base-fret 0 frets x 0 4 4 1 2","Am6/7":"Am6/7 base-fret 0 frets x 0 2 0 1 2","Am7(4)":"Am7(4) base-fret 0 frets x 0 0 0 1 0","Ama11":"Ama11 base-fret 3 frets 3 2 4 x 1 x","Ama13":"Ama13 base-fret 0 frets x 0 2 1 2 2","A#m(4)":"A#m(4) base-fret 0 frets x 1 1 3 2 1","A#m6/9":"A#m6/9 base-fret 3 frets 4 2 1 3 x 1","A#m6/7":"A#m6/7 base-fret 0 frets x 1 3 1 2 3","A#m7(4)":"A#m7(4) base-fret 0 frets x 1 1 1 2 1","A#ma11":"A#ma11 base-fret 0 frets x 1 0 2 4 x","A#ma13":"A#ma13 base-fret 0 frets x 1 3 2 3 3","Bm(4)":"Bm(4) base-fret 0 frets x 2 2 4 3 2","Bm6/9":"Bm6/9 base-fret 0 frets x 2 0 1 2 2","Bm6/7":"Bm6/7 base-fret 0 frets x 2 4 2 3 4","Bm7(4)":"Bm7(4) base-fret 0 frets x 2 2 2 3 2","Bma11":"Bma11 base-fret 0 frets x 2 1 3 0 0","Bma13":"Bma13 base-fret 0 frets x 2 4 3 4 4","Cm(4)":"Cm(4) base-fret 0 frets x 3 3 x 4 3","Cm6/9":"Cm6/9 base-fret 0 frets x 3 1 2 3 x","Cm6/7":"Cm6/7 base-fret 3 frets x 1 3 1 2 3","Cm7(4)":"Cm7(4) base-fret 0 frets x 3 1 3 1 1","Cma11":"Cma11 base-fret 0 frets x 3 2 4 1 1","Cma13":"Cma13 base-fret 2 frets x 2 1 3 4 4","C#m(4)":"C#m(4) base-fret 0 frets x 4 2 1 2 2","C#m6/9":"C#m6/9 base-fret 0 frets x 4 2 3 4 4","C#m6/7":"C#m6/7 base-fret 0 frets x 4 2 3 0 0","C#m7(4)":"C#m7(4) base-fret 0 frets x 4 2 4 2 2","C#ma11":"C#ma11 base-fret 0 frets x 4 3 1 1 2","C#ma13":"C#ma13 base-fret 3 frets x 2 4 3 4 4","Dm(4)":"Dm(4) base-fret 2 frets x 4 2 1 2 2","Dm6/9":"Dm6/9 base-fret 2 frets x 4 2 1 0 0","Dm6/7":"Dm6/7 base-fret 0 frets x x 0 4 1 1","Dm7(4)":"Dm7(4) base-fret 0 frets x x 0 0 1 1","Dma11":"Dma11 base-fret 2 frets x 4 3 1 1 2","Dma13":"Dma13 base-fret 4 frets x 2 1 3 4 4","D#m(4)":"D#m(4) base-fret 3 frets x 4 2 1 2 2","D#m6/9":"D#m6/9 base-fret 3 frets x 4 2 3 4 4","D#m6/7":"D#m6/7 base-fret 5 frets x 2 4 2 3 4","D#m7(4)":"D#m7(4) base-fret 0 frets x x 1 1 2 2","D#ma11":"D#ma11 base-fret 0 frets x x 1 0 3 4","D#ma13":"D#ma13 base-fret 5 frets x 2 4 3 4 4","Em(4)":"Em(4) base-fret 0 frets 0 0 2 0 0 0","Em6/9":"Em6/9 base-fret 0 frets 0 2 2 0 2 2","Em6/7":"Em6/7 base-fret 0 frets 0 4 0 0 0 0","Em7(4)":"Em7(4) base-fret 0 frets x x 2 2 3 3","Ema11":"Ema11 base-fret 0 frets 0 x 4 2 4 4","Ema13":"Ema13 base-fret 0 frets 0 2 1 1 2 0","Fm(4)":"Fm(4) base-fret 0 frets 1 1 3 1 1 1","Fm6/9":"Fm6/9 base-fret 0 frets 1 3 x 1 3 3","Fm6/7":"Fm6/7 base-fret 0 frets 1 3 1 1 3 1","Fm7(4)":"Fm7(4) base-fret 0 frets 1 1 1 1 1 1","Fma11":"Fma11 base-fret 0 frets 1 0 2 3 1 0","Fma13":"Fma13 base-fret 0 frets 1 x 2 2 3 1","F#m(4)":"F#m(4) base-fret 0 frets 2 2 4 2 2 2","F#m6/9":"F#m6/9 base-fret 0 frets 2 x 4 2 4 4","F#m6/7":"F#m6/7 base-fret 0 frets 2 4 2 2 4 2","F#m7(4)":"F#m7(4) base-fret 0 frets 2 2 2 2 2 2","F#ma11":"F#ma11 base-fret 0 frets 2 1 3 4 x 1","F#ma13":"F#ma13 base-fret 0 frets 2 1 3 1 4 1","Gm(4)":"Gm(4) base-fret 0 frets 3 3 x 3 3 3","Gm6/9":"Gm6/9 base-fret 0 frets 3 1 2 2 3 x","Gm6/7":"Gm6/7 base-fret 0 frets 3 1 2 3 x 1","Gm7(4)":"Gm7(4) base-fret 0 frets 3 3 3 3 3 3","Gma11":"Gma11 base-fret 0 frets 3 2 4 x 1 x","Gma13":"Gma13 base-fret 0 frets 3 2 4 0 0 0","G#m(4)":"G#m(4) base-fret 0 frets 4 2 1 1 2 x","G#m6/9":"G#m6/9 base-fret 0 frets 4 2 1 3 x 1","G#m6/7":"G#m6/7 base-fret 0 frets 4 2 3 4 x 2","G#m7(4)":"G#m7(4) base-fret 0 frets 4 4 4 4 4 4","G#ma11":"G#ma11 base-fret 0 frets 4 3 x x 2 3","G#ma13":"G#ma13 base-fret 0 frets 4 3 x 0 2 1"}');var Vr=class r{constructor(s){this.definitions=s||{}}get(s){return this.definitions[s]||null}withDefaults(){let s=fc(ga),e=this.clone();return Object.keys(s).forEach(a=>{let f=qn.parse(s[a]);e.has(a)||e.add(a,f)}),e}add(s,e){this.definitions[s]=e}has(s){return s in this.definitions}clone(){let s=new r;return Object.keys(this.definitions).forEach(e=>{s.add(e,this.definitions[e].clone())}),s}},Cf=Vr,Kr=class r{constructor({font:s,size:e,colour:a}={font:null,size:null,colour:null}){this.font=null,this.size=null,this.colour=null,this.font=s?s.replace(/"/g,"'"):null,this.size=e||null,this.colour=a||null}clone(){return new r({font:this.font,size:this.size,colour:this.colour})}toCssString(){let s={};return this.colour&&(s.color=this.colour),this.font&&this.size?s.font=`${this.size} ${this.font}`:this.font?s["font-family"]=this.font:this.size&&(s["font-size"]=`${this.size}`),Object.keys(s).map(e=>`${e}: ${s[e]}`).join("; ")}},Yt=Kr,qr=class r{constructor({type:s,items:e}={type:Xs,items:[]}){this.items=[],this.type=Xs,this.currentChordLyricsPair=new Fe,this.key=null,this.transposeKey=null,this.lineNumber=null,this.selector=null,this.selectorIsNegated=!1,this.textFont=new Yt,this.chordFont=new Yt,this.type=s,this.items=e}isEmpty(){return this.items.length===0}addItem(s){if(s instanceof le)this.addTag(s);else if(s instanceof Fe)this.addChordLyricsPair(s);else if(s instanceof tt)this.addComment(s);else{let e=s;e.parentLine=this,this.items.push(e)}}hasRenderableItems(){return this.items.some(s=>s.isRenderable())}clone(){return this.mapItems(null)}mapItems(s){let e=new r;return e.items=this.items.map(a=>{let f=a.clone();return s?s(f):f}).filter(a=>a!==null),e.type=this.type,e}isBridge(){return this.type===ot}isChorus(){return this.type===Ts}isGrid(){return this.type===li}isTab(){return this.type===ui}isVerse(){return this.type===ct}isPart(){return this.type===Zt}hasContent(){return this.hasRenderableItems()}addChordLyricsPair(s=null,e=null){return s instanceof Fe?this.currentChordLyricsPair=s:this.currentChordLyricsPair=new Fe(s||"",e||""),this.currentChordLyricsPair.parentLine=this,this.items.push(this.currentChordLyricsPair),this.currentChordLyricsPair}ensureChordLyricsPair(){this.currentChordLyricsPair||this.addChordLyricsPair()}chords(s){this.ensureChordLyricsPair(),this.currentChordLyricsPair.chords+=s}lyrics(s){this.ensureChordLyricsPair(),this.currentChordLyricsPair.lyrics+=s}addTag(s,e=null){let a=s instanceof le?s:new le(s,e);return a.parentLine=this,this.items.push(a),a}addComment(s){let e=s instanceof tt?s:new tt(s);return e.parentLine=this,this.items.push(e),e}set(s){return new r({type:this.type,items:this.items,...s})}get _tag(){if(this.items.length!==1)return null;let s=this.items[0];return s instanceof le?s:null}isSectionStart(){var s;return((s=this._tag)==null?void 0:s.isSectionStart())||!1}isSectionEnd(){var s;return((s=this._tag)==null?void 0:s.isSectionEnd())||!1}},Ur=qr,Yr=class r{static expand(s,e){return new r(s,e).expand()}constructor(s,e){this.line=s,this.song=e}expand(){let s=this.line.items.flatMap(e=>e instanceof le&&e.name===Ts?this.getLastChorusBefore(this.line.lineNumber):[]);return[this.line,...s]}getLastChorusBefore(s){let e=[];if(!s)return e;for(let a=s-1;a>=0;a-=1){let f=this.song.lines[a];if(f.type!==Ts&&e.length>0)break;f.type===Ts&&(f.isEmpty()||this.lineHasMoreThanChorusDirectives(f))&&e.unshift(f)}return e}lineHasMoreThanChorusDirectives(s){return s.items.some(e=>!(e instanceof le&&(e.name===ut||e.name===Qt)))}},Af=Yr,Xr=class{get key(){return this.getSingleMetadataValue(Ms)}get title(){return this.getSingleMetadataValue(Ai)}get subtitle(){return this.getSingleMetadataValue(Ci)}get capo(){return this.getMetadataValue(Jt)}get duration(){return this.getSingleMetadataValue(Qn)}get tempo(){return this.getSingleMetadataValue(ca)}get time(){return this.getMetadataValue(fa)}get year(){return this.getSingleMetadataValue(ua)}get album(){return this.getMetadataValue(Yn)}get copyright(){return this.getSingleMetadataValue(Jn)}get lyricist(){return this.getMetadataValue(ra)}get artist(){return this.getMetadataValue(Xn)}get composer(){return this.getMetadataValue(Zn)}},ha=Xr;function Sf(r,s){r.includes(s)||r.push(s)}var Zr=class r extends ha{constructor(s={}){super(),this.metadata={},this.providers=new Map,s instanceof r?this.assign(s.metadata):this.assign(s)}merge(s={}){let e=this.clone();return s instanceof r?e.assign(s.metadata):e.assign(s),e}contains(s){return s in this.metadata}add(s,e){if(!En(s)){if(!(s in this.metadata)){this.metadata[s]=e;return}this.appendValue(s,e)}}appendValue(s,e){let a=this.metadata[s];if(a!==e){if(a instanceof Array){Sf(a,e);return}this.metadata[s]=[a,e]}}setProvider(s,e){this.providers.set(s,e)}set(s,e){e?this.metadata[s]=e:delete this.metadata[s]}getMetadataValue(s){return this.get(s)}getSingleMetadataValue(s){return this.getSingle(s)}get(s){if(s===kt)return this.calculateKeyFromCapo();if(s in this.metadata)return this.metadata[s];let e=this.providers.get(s);return e?e():this.getArrayItem(s)}all(){let s={};this.providers.forEach((a,f)=>{let l=a();l!==null&&(s[f]=l)}),Object.assign(s,this.metadata);let e=this.calculateKeyFromCapo();return e&&(s[kt]=e),s}ownMetadata(){let s={...this.metadata},e=this.calculateKeyFromCapo();return e&&(s[kt]=e),s}[Symbol.iterator](){return Object.entries(this.ownMetadata())[Symbol.iterator]()}getSingle(s){let e=this.get(s);return Array.isArray(e)?e[0]:e}parseArrayKey(s){let e=s.match(/(.+)\.(-?\d+)$/);if(!e)return null;let a=e[1],f=parseInt(e[2],10);return[a,f]}getArrayItem(s){let e=this.parseArrayKey(s);if(e===null)return null;let[a,f]=e,l=this.metadata[a]||[],h=f;return h<0?h=l.length+h:h>0&&(h-=1),l[h]}clone(){let s=new r(this.metadata);return this.providers.forEach((e,a)=>s.setProvider(a,e)),s}calculateKeyFromCapo(){let s=this.getSingle(Jt),e=this.getSingle(Ms);if(s&&e){let a=Te.parse(e);if(!a)throw new Error(`Could not parse ${e}`);let f=parseInt(s,10);return a.transpose(f).normalize().toString()}return null}assign(s){Object.keys(s).filter(e=>!En(e)).forEach(e=>{let a=s[e];a!=null&&(a instanceof Array?this.metadata[e]=[...a]:a===null?delete this.metadata[e]:this.metadata[e]=a.toString())})}},Jr=Zr;function vn(r,s){let e=[...new Set(r)];return e.length===1?e[0]:s}var Qr=class{addLine(s){this.lines.push(s)}isLiteral(){let{lines:s}=this;return this.isEmpty()?!1:s.every(e=>e.items.every(a=>!!(a instanceof us||a instanceof le&&a.isSectionDelimiter())))}get contents(){return this.lines.filter(s=>s.items.every(e=>e instanceof us)).map(s=>s.items.map(e=>e.string).join("")).join(`
`)}get label(){if(this.lines.length===0)return null;let s=this.lines[0].items.find(e=>e instanceof le&&e.isSectionDelimiter());return s?s.label:null}get type(){let s=this.lines.map(e=>e.type);return vn(s,mc)}get selector(){let s=this.lines.map(e=>e.selector).filter(e=>e!==null);return vn(s,null)}get selectorIsNegated(){return this.lines.some(s=>s.selectorIsNegated)}hasRenderableItems(){return this.lines.some(s=>s.hasRenderableItems())}isEmpty(){return this.lines.length===0}constructor(){this.lines=[]}},Dn=Qr,ei=class r{constructor(s,e){this.fontSize=s,this.unit=e}clone(){return new r(this.fontSize,this.unit)}multiply(s){return new r(this.fontSize*s/100,this.unit)}toString(){return`${this.fontSize}${this.unit}`}static parse(s,e){let a=s.trim(),f=parseFloat(a);return Number.isNaN(f)?this.parseNotANumber(e):a.slice(-1)==="%"?this.parsePercentage(f,e):new r(f,"px")}static parseNotANumber(s){return s?s.clone():new r(100,"%")}static parsePercentage(s,e){return e?e.multiply(s):new r(s,"%")}},Ef=ei,si=class{applyTag(s){switch(s.name){case Ht:this.textFont.font=this.pushOrPopTag(s);break;case Vt:this.textFont.size=this.pushOrPopSizeTag(s);break;case Nr:this.textFont.colour=this.pushOrPopTag(s);break;case Ot:this.chordFont.font=this.pushOrPopTag(s);break;case Wt:this.chordFont.size=this.pushOrPopSizeTag(s);break;case kr:this.chordFont.colour=this.pushOrPopTag(s);break;default:break}}pushOrPopTag(s){let{value:e}=s;return s.hasValue()?this.fontAndColourStacks[s.name].push(e):(this.fontAndColourStacks[s.name].pop(),e=this.fontAndColourStacks[s.name].slice(-1)[0]||null),e}pushOrPopSizeTag(s){let{value:e}=s;if(s.hasValue()){let a=this.sizeStacks[s.name].slice(-1)[0]||null,f=Ef.parse(e,a);return this.sizeStacks[s.name].push(f),f}return this.sizeStacks[s.name].pop(),this.sizeStacks[s.name].slice(-1)[0]||null}constructor(){this.fontAndColourStacks={[kr]:[],[Ot]:[],[Nr]:[],[Ht]:[]},this.sizeStacks={[Wt]:[],[Vt]:[]},this.textFont=new Yt,this.chordFont=new Yt}},Ff=si,ti=class{constructor(s,e,a){this.lineNumber=null,this.column=null,this.message=s,this.lineNumber=e,this.column=a}toString(){return`Warning: ${this.message} on line ${this.lineNumber||"?"} column ${this.column||"?"}`}},Lf=ti,ri=class{constructor(s){this.currentKey=null,this.currentLine=null,this.fontStack=new Ff,this.lines=[],this.metadata=new Jr,this.sectionType=Xs,this.selector=null,this.selectorIsNegated=!1,this.transposeKey=null,this.warnings=[],this.song=s,this.song.lines=this.lines,this.song.warnings=this.warnings}get previousLine(){let s=this.lines.length;return s>=2?this.lines[s-2]:null}addLine(s){var e;return s?this.currentLine=s:(this.currentLine=new Ur,this.lines.push(this.currentLine)),this.setCurrentProperties(this.sectionType,this.selector,this.selectorIsNegated),this.currentLine.transposeKey=(e=this.transposeKey)!=null?e:this.currentKey,this.currentLine.key=this.currentKey||this.song.getMetadata().getSingle(Ms),this.currentLine.lineNumber=this.lines.length-1,this.currentLine}setCurrentProperties(s,e=null,a=!1){if(!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.type=s,this.currentLine.selector=e,this.currentLine.selectorIsNegated=a,this.currentLine.textFont=this.fontStack.textFont.clone(),this.currentLine.chordFont=this.fontStack.chordFont.clone()}addItem(s){if(s instanceof le)this.addTag(s);else{if(this.ensureLine(),!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.addItem(s)}}chords(s){if(!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.chords(s)}lyrics(s){if(this.ensureLine(),!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.lyrics(s)}addTag(s){let e=le.parseOrFail(s);return this.applyTagOnSong(e),this.applyTagOnLine(e),e}ensureLine(){this.currentLine===null&&this.addLine()}applyTagOnSong(s){s.name===Oc?this.transposeKey=s.value:s.name===la?this.currentKey=s.value:s.isSectionDelimiter()?this.setSectionTypeFromTag(s):s.isInlineFontTag()&&this.fontStack.applyTag(s)}applyTagOnLine(s){if(this.ensureLine(),!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.addTag(s)}setSectionTypeFromTag(s){let[e,a]=Rr.interpret(s.name,s.value);a&&(e===Js?this.startSection(a,s):e===Qs&&this.endSection(a===In?this.sectionType:a,s))}startSection(s,e){this.checkCurrentSectionType(Xs,e),this.selector=e.selector,this.selectorIsNegated=e.isNegated,s===Zt&&e.value?this.sectionType=e.value.split(" ")[0].toLowerCase():this.sectionType=s,this.setCurrentProperties(s,e.selector,e.isNegated)}endSection(s,e){this.checkCurrentSectionType(s,e),this.sectionType=Xs,this.selector=null,this.selectorIsNegated=!1}checkCurrentSectionType(s,e){this.sectionType!==s&&!(s==="part"&&e.name==="end_of_part")&&this.addWarning(`Unexpected tag {${e.originalName}}, current section is: ${this.sectionType}`,e)}addWarning(s,{line:e,column:a}){let f=new Lf(s,e||null,a||null);this.warnings.push(f)}},Xt=ri,ii=class{constructor(s){this.addedLine=!1,this.song=s,this.clonedSong=new ai,this.builder=new Xt(this.clonedSong)}mapItems(s){return this.song.lines.forEach(e=>{this.mapLineItems(e,s)}),this.clonedSong}mapLineItems(s,e){s.items.forEach(a=>{this.mapItem(e,a)}),s.isEmpty()&&this.ensureLine(),this.addedLine=!1}mapItem(s,e){let a=s(e);if(a===null)return;let f=Array.isArray(a);(!f||a.length>0)&&this.ensureLine(),f?a.forEach(l=>this.builder.addItem(l)):this.builder.addItem(a)}ensureLine(){this.addedLine||(this.builder.addLine(),this.addedLine=!0)}},wf=ii;function wr({selector:r,isNegated:s},{configuration:e,metadata:a}){var h,S;if(r===((h=e.instrument)==null?void 0:h.type)||r===((S=e.user)==null?void 0:S.name))return!s;let f=a.getSingle(r),l=f&&f!=="";return s?!l:!!l}function vf(r){let s=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),a=String(r.getDate()).padStart(2,"0");return`${s}-${e}-${a}`}function da(){let r=new Map;return r.set("chordpro",()=>"ChordPro"),r.set("chordpro.version",()=>"14.0.0"),r.set("today",()=>vf(new Date)),r}function Df(r){let s=da(),{instrument:e,user:a}=r;return s.set("instrument",()=>{var f;return(f=e==null?void 0:e.type)!=null?f:null}),s.set("instrument.type",()=>{var f;return(f=e==null?void 0:e.type)!=null?f:null}),s.set("instrument.description",()=>{var f;return(f=e==null?void 0:e.description)!=null?f:null}),s.set("tuning",()=>{var f;return(f=e==null?void 0:e.tuning)!=null?f:null}),s.set("user",()=>{var f;return(f=a==null?void 0:a.name)!=null?f:null}),s.set("user.name",()=>{var f;return(f=a==null?void 0:a.name)!=null?f:null}),s.set("user.fullname",()=>{var f;return(f=a==null?void 0:a.fullname)!=null?f:null}),s}var ni=class r extends ha{constructor(s=null){super(),this.lines=[],this._bodyLines=null,this._bodyParagraphs=null,this._renderParagraphs=null,this.warnings=[],this._metadata=null,s&&(this._metadata=new Jr(s))}get bodyLines(){var s;return(s=this._bodyLines)!=null||(this._bodyLines=this.selectRenderableItems(this.lines)),this._bodyLines}get bodyParagraphs(){var s;return(s=this._bodyParagraphs)!=null||(this._bodyParagraphs=this.selectRenderableItems(this.paragraphs)),this._bodyParagraphs}get renderParagraphs(){var s;return(s=this._renderParagraphs)!=null?s:this.bodyParagraphs}set renderParagraphs(s){this._renderParagraphs=s}selectRenderableItems(s){let e=[...s];for(;e.length&&!e[0].hasRenderableItems();)e.shift();return e}get paragraphs(){return this.linesToParagraphs(this.lines)}get expandedBodyParagraphs(){let s=this.lines.flatMap(e=>Af.expand(e,this));return this.selectRenderableItems(this.linesToParagraphs(s))}filterParagraphs(s,e){let a={configuration:e,metadata:this.metadata};return s.filter(f=>{let{selector:l,selectorIsNegated:h}=f;return l?wr({selector:l,isNegated:h},a):!0})}linesToParagraphs(s){let e=new Dn,a=[e];return s.forEach((f,l)=>{let h=s[l+1]||null;f.isEmpty()||f.isSectionEnd()&&h&&!h.isEmpty()?(e=new Dn,a.push(e)):f.hasRenderableItems()&&e.addLine(f)}),a}clone(){let s=new r;return s.warnings=[...this.warnings],s.lines=this.lines.map(e=>e.clone()),s}getMetadataValue(s){return this.metadata.getMetadataValue(s)}getSingleMetadataValue(s){return this.metadata.getSingleMetadataValue(s)}setKey(s){let e=s?s.toString():null;return this.changeMetadata(Ms,e)}setCapo(s){let e=s?s.toString():null;return this.changeMetadata(Jt,e)}updateDirectives(s){let e={...s},a=Fc(e,(l,h)=>h!==null&&!this.metadata.contains(l)),f=this.changeOrDeleteDirectives(e);return f.insertDirectives(a),f}changeOrDeleteDirectives(s){let e={...s};return this.mapItems(a=>{if(!(a instanceof le))return a;let f=a;if(!(f.name in e&&f.isMetaTag()))return a;let l=e[f.name];return l===null?null:(e[f.name]=null,[l].flat().map(h=>new le(f.name,h)))})}insertDirectives(s,{after:e=null}={}){let a=this.findInsertIndex(e),f=this.adjustInsertIndex(a),l=this.createMetadataLines(s),h=this.prepareLinesToInsert(l,a,f);this.spliceLines(f,h)}findInsertIndex(s){return this.lines.findIndex(e=>e.items.some(a=>this.isInsertionPoint(a,s)))}isInsertionPoint(s,e){return!(s instanceof le)||e&&s.name===e?!0:s.isComment()||s.isSectionDelimiter()}adjustInsertIndex(s){if(s<=0)return s;for(let e=s-1;e>=0;e-=1)if(!this.lines[e].isEmpty())return e+1;return 0}createMetadataLines(s){return Object.keys(s).flatMap(e=>[s[e]].flat().map(f=>{let l=new Ur;return l.addTag(e,f),l}))}prepareLinesToInsert(s,e,a){let f=[...s];return!(e>a&&this.lines.slice(a,e).some(h=>h.isEmpty()))&&s.length>0&&f.push(new Ur),f}spliceLines(s,e){let{lines:a}=this;this.lines=[...a.slice(0,s),...e,...a.slice(s)]}transpose(s,{accidental:e=null,normalizeChordSuffix:a=!1}={}){let f=null;return this.mapItems(l=>l instanceof le&&l.name===Ms?(f=Te.wrapOrFail(l.value).transpose(s).normalize(),e&&(f=f.useAccidental(e)),l.set({value:f.toString()})):l instanceof Fe?r.transposeChordLyricsPair(l,s,f,a,e):l instanceof us&&r.isMusicalSection(l.parentLine)?r.transposeLiteral(l,s,f,a,e):l)}static transposeChordLyricsPair(s,e,a,f,l){let h=s.transpose(e,a,{normalizeChordSuffix:f});return l&&(h=h.useAccidental(l)),h}static transposeLiteral(s,e,a,f,l){return r.mapChordsInLiteral(s,h=>{let S=h.transpose(e);return a&&(S=S.normalize(a,{normalizeSuffix:f})),l&&(S=S.useAccidental(l)),S})}transposeUp({normalizeChordSuffix:s=!1}={}){return this.transpose(1,{normalizeChordSuffix:s})}transposeDown({normalizeChordSuffix:s=!1}={}){return this.transpose(-1,{normalizeChordSuffix:s})}changeKey(s){let e=this.requireCurrentKey(),a=Te.wrapOrFail(s),f=e.distanceTo(a);return this.transpose(f,{accidental:a.accidental})}useAccidental(s){let{currentKey:e}=this,a=this.mapChordLyricsPairs(f=>f.useAccidental(s));return e&&e.accidental!==s&&(a=a.changeKey(e.useAccidental(s))),a}useModifier(s){return Je("useModifier is deprecated, use useAccidental instead"),this.useAccidental(s)}normalizeChords(s=null,{normalizeSuffix:e=!0}={}){return this.changeChords(a=>a.normalize(s,{normalizeSuffix:e}))}mapChordLyricsPairs(s){return this.mapItems(e=>e instanceof Fe?s(e):e)}changeChords(s){return this.mapItems(e=>e instanceof Fe?e.changeChord(s):e instanceof us&&r.isMusicalSection(e.parentLine)?r.mapChordsInLiteral(e,s):e)}static isMusicalSection(s){return s===null||![gi,mi,hi,di].includes(s.type)}static mapChordsInLiteral(s,e){let a=s.string.replace(/(\s|^)(\S+)(?=\s|$)/g,(f,l,h)=>{let S=nt.parse(h);return S?`${l}${e(S).toString()}`:`${l}${h}`});return new us(a)}get currentKey(){return Te.wrap(this.key)}requireCurrentKey(){let{currentKey:s}=this;if(!s)throw new Error(`
Cannot change song key, the original key is unknown.

Either ensure a key directive is present in the song (when using chordpro):
  \`{key: C}\`

Or set the song key before changing key:
  \`song.setKey('C');\``.substring(1));return s}changeMetadata(s,e){if(typeof s=="string"){if(typeof e=="undefined")throw new Error("Value is required when name is a string");return this.changeMetadata({[s]:e})}let a=this.updateDirectives(s);return a.metadata.assign(s),a}addLine(s){this.lines.push(s)}mapItems(s){return new wf(this).mapItems(s)}foreachItem(s){this.lines.forEach(e=>{e.items.forEach(s)})}getChords(){let s=new Set;return this.foreachItem(e=>{if(!(e instanceof Fe))return;let a=e.chords;if(a&&a.length>0){let f=nt.parse(a);f&&s.add(f.toString())}}),Array.from(s)}getChordDefinitions(s){let e={};return this.foreachItem(a=>{if(!(a instanceof le))return;let{chordDefinition:f,selector:l,isNegated:h}=a;l&&s&&!wr({selector:l,isNegated:h},s)||f&&(e[f.name]=f.clone())}),e}get metadata(){return this._metadata||(this._metadata=this.getMetadata()),this._metadata}getMetadata(s){let e=new Jr;(s?Df(s):da()).forEach((l,h)=>e.setProvider(h,l));let f=()=>this.getChords();return e.setProvider("chords",()=>{let l=f();return l.length?l.join(", "):null}),e.setProvider("numchords",()=>f().length.toString()),e.setProvider("key_actual",()=>{var l;return(l=e.getSingle("_key"))!=null?l:e.getSingle("key")}),e.setProvider("key_from",()=>e.getSingle("key")),this.foreachItem(l=>{if(!(l instanceof le))return;let h=l;if(!h.isMetaTag())return;let{selector:S,isNegated:D}=h;S&&s&&!wr({selector:S,isNegated:D},{metadata:e,configuration:s})||e.add(l.name,l.value)}),e}get chordDefinitions(){return new Cf(this.getChordDefinitions())}mapLines(s){let e=new r,a=new Xt(e);return this.lines.forEach(f=>{let l=s(f);l&&(a.addLine(),l.items.forEach(h=>a.addItem(h)))}),e}updateItem(s,e,a){let f=!1,l=this.mapItems(h=>s(h)?(f=!0,e(h)):h);return f?l:a(l)}removeItem(s){return this.mapLines(e=>{let{items:a}=e,f=a.findIndex(s);return f===-1?e:a.length===1?null:e.set({items:[...a.slice(0,f),...a.slice(f+1)]})})}},ai=ni,Tn="chordLyricsPair",Mn="chordSheet",Gn="comment",Bn="line",jn="softLineBreak",Pn="tag",kn="ternary",oi=class{serialize(s){return{type:Mn,lines:s.lines.map(e=>this.serializeLine(e))}}serializeLine(s){return{type:Bn,items:s.items.map(e=>this.serializeItem(e))}}serializeItem(s){let a=new Map([[le,this.serializeTag.bind(this)],[Fe,this.serializeChordLyricsPair.bind(this)],[wn,this.serializeTernary.bind(this)],[us,this.serializeLiteral.bind(this)],[tt,this.serializeComment.bind(this)],[Fn,()=>({type:jn})]]).get(s.constructor);if(!a)throw new Error(`Don't know how to serialize ${s.constructor.name}`);return a(s)}serializeChordDefinition(s){return{name:s.name,baseFret:s.baseFret,frets:s.frets,fingers:s.fingers}}serializeTag(s){let e={type:Pn,name:s.originalName,value:s.value,attributes:s.attributes||{}};return s.chordDefinition&&(e.chordDefinition=this.serializeChordDefinition(s.chordDefinition)),e}serializeChordLyricsPair(s){let e={type:Tn,chords:s.chords,chord:null,lyrics:s.lyrics,annotation:s.annotation};return s.isRhythmSymbol&&(e.isRhythmSymbol=!0),e}serializeTernary(s){return{type:kn,variable:s.variable,valueTest:s.valueTest,trueExpression:this.serializeExpression(s.trueExpression),falseExpression:this.serializeExpression(s.falseExpression)}}serializeLiteral(s){return s.string}serializeExpression(s){return s.map(e=>this.serializeItem(e))}serializeComment(s){return{type:Gn,comment:s.content}}deserialize(s,e={}){var a;return this.notation=(a=e.notation)!=null?a:null,this.parseAstComponent(s),this.song}parseAstComponent(s){if(typeof s=="string")return new us(s);switch(s.type){case Mn:this.parseChordSheet(s);break;case Tn:return this.parseChordLyricsPair(s);case Gn:return this.parseComment(s);case jn:return new Fn;case Pn:return this.parseTag(s);case kn:return this.parseTernary(s);case Bn:this.parseLine(s);break;default:Vn(`Unhandled AST component "${s.type}"`)}return null}parseChordSheet(s){let{lines:e}=s;this.song=new ai,this.songBuilder=new Xt(this.song),e.forEach(a=>this.parseAstComponent(a))}parseLine(s){let{items:e}=s;this.songBuilder.addLine(),e.forEach(a=>{let f=this.parseAstComponent(a);this.songBuilder.addItem(f)})}parseChordLyricsPair(s){let{chord:e,chords:a,lyrics:f,annotation:l,isRhythmSymbol:h}=s,S=e?new nt(e).toString():a,D=this.notation&&S?nt.parse(S,{notation:this.notation}):null;return new Fe(D?D.toString():S,f,l,D,h||!1)}parseTag(s){let{name:e,value:a,location:{offset:f=null,line:l=null,column:h=null}={},chordDefinition:S,attributes:D,selector:A,isNegated:x}=s,w=new le(e,a,{line:l,column:h,offset:f},D);return w.selector=A||null,w.isNegated=x||!1,S&&(w.chordDefinition=new qn(S.name,S.baseFret,S.frets,S.fingers)),w}parseComment(s){let{comment:e}=s;return new tt(e)}parseTernary(s){let{variable:e,valueTest:a,trueExpression:f,falseExpression:l,location:{offset:h=null,line:S=null,column:D=null}={}}=s;return new wn({variable:e,valueTest:a,trueExpression:this.parseExpression(f),falseExpression:this.parseExpression(l),offset:h,line:S,column:D})}parseExpression(s){return(s||[]).map(e=>this.parseAstComponent(e)).filter(e=>e!==null)}constructor(){this.song=new ai,this.songBuilder=new Xt(this.song),this.notation=null}},Tf=oi,ci=class{trace(){}},Mf=ci;function Gf(r){return r.replace(/\n$/,"").split(`
`)}function Nt(r){return{type:"line",items:r}}function Bf(r,s,e){return[Nt([r]),...Gf(e).map(a=>Nt([a])),Nt([s])]}function vr(r,s,e,a){return{type:"tag",name:r,location:a.start,value:(s==null?void 0:s.value)||"",attributes:(s==null?void 0:s.attributes)||{},selector:e==null?void 0:e.value,isNegated:e==null?void 0:e.isNegated}}function jf(r,s,e,a=f=>f){let f=new RegExp(s,"g"),l=Array.from(r.matchAll(f)),h=[],S=0;l.forEach(A=>{let x=r.slice(S,A.index);x!==""&&h.push(a(x)),h.push(e(A[0])),S=A.index+A[0].length});let D=r.slice(S);return D!==""&&h.push(a(D)),h}function ba(r){return jf(r,"\xA0",()=>({type:"softLineBreak"}),s=>({type:"chordLyricsPair",chords:"",lyrics:s}))}function Pf(r,s){let e=ba(s||""),[a,...f]=e,l=e[0],h=null;return r!==""&&(!l||l.type==="softLineBreak"?h={type:"chordLyricsPair",chords:r,lyrics:""}:l={...l,chords:r}),[h,l||null,...f].filter(S=>S!==null)}function Nn(r){return typeof r!="string"&&r.type==="chordLyricsPair"}function kf(r,s){return Nn(r)&&Nn(s)&&r.chords.length>0&&s.chords.length===0}function Nf(r,s){return{...r,lyrics:`${r.lyrics}${s.lyrics}`}}function If(r,s){if(s!==!1)return r;let e=[];for(let a=0,{length:f}=r;a<f;a+=1)r[a+1]&&kf(r[a],r[a+1])?(e.push(Nf(r[a],r[a+1])),a+=1):e.push(r[a]);return e}function Dr(r,s,e){return e=e||" ",r.length>s?r:(s-=r.length,e+=e.repeat(s),r+e.slice(0,s))}var rt=class r extends Error{static buildMessage(s,e){function a(A){return A.charCodeAt(0).toString(16).toUpperCase()}function f(A){return A.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function l(A){return A.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function h(A){switch(A.type){case"literal":return'"'+f(A.text)+'"';case"class":let x=A.parts.map(w=>Array.isArray(w)?l(w[0])+"-"+l(w[1]):l(w));return"["+(A.inverted?"^":"")+x+"]";case"any":return"any character";case"end":return"end of input";case"other":return A.description}}function S(A){let x=A.map(h),w,P;if(x.sort(),x.length>0){for(w=1,P=1;w<x.length;w++)x[w-1]!==x[w]&&(x[P]=x[w],P++);x.length=P}switch(x.length){case 1:return x[0];case 2:return x[0]+" or "+x[1];default:return x.slice(0,-1).join(", ")+", or "+x[x.length-1]}}function D(A){return A?'"'+f(A)+'"':"end of input"}return"Expected "+S(s)+" but "+D(e)+" found."}constructor(s,e,a,f){super(),this.message=s,this.expected=e,this.found=a,this.location=f,this.name="PeggySyntaxError",typeof Object.setPrototypeOf=="function"?Object.setPrototypeOf(this,r.prototype):this.__proto__=r.prototype,typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,r)}format(s){let e="Error: "+this.message;if(this.location){let a=null,f;for(f=0;f<s.length;f++)if(s[f].grammarSource===this.location.source){a=s[f].text.split(/\r\n|\n|\r/g);break}let l=this.location.start,h=this.location.source+":"+l.line+":"+l.column;if(a){let S=this.location.end,D=Dr("",l.line.toString().length," "),A=a[l.line-1],x=l.line===S.line?S.column:A.length+1;e+=`
 --> `+h+`
`+D+` |
`+l.line+" | "+A+`
`+D+" | "+Dr("",l.column-1," ")+Dr("",x-l.column,"^")}else e+=`
 at `+h}return e}};function Rf(r,s){s=s!==void 0?s:{};let e={},a=s.grammarSource,f={ChordSheet:Zi},l=Zi,h=function(t,n){return{type:"chordSheet",lines:[...t,n].flat()}},S=function(t){return t},D=function(t,n,o,c){return Nt([t?{type:"chordLyricsPair",chords:"",lyrics:t}:null,...If(n.flat(),s.chopFirstWord),o?{type:"chordLyricsPair",chords:o,lyrics:""}:null,c?{type:"comment",comment:c}:null].filter(g=>g!==null))},A=function(t){return ba(t)},x="#",w=I("#",!1),P=/^[^\r\n]/,j=me(["\r",`
`],!0,!1),X=function(t){return t},ie=function(t,n,o){return{type:"chordLyricsPair",annotation:t||"",lyrics:n+(o||"")}},U=function(t,n,o){let c=n.map(g=>g.char||g).join("")+(o||"");return Pf(t||"",c)},V=function(t){return t.map(n=>n.char||n).join("")},W="[*",K=I("[*",!1),Y="]",Z=I("]",!1),be=function(t){return t.map(n=>n.char||n).join("")},Ce="[",Le=I("[",!1),ce=function(t){return t.map(n=>n.char||n).join("")},J=/^[^\]\r\n]/,fe=me(["]","\r",`
`],!0,!1),ae="\\",de=I("\\",!1),ke=function(){return{type:"char",char:"\\"}},Gs=function(){return{type:"char",char:"]"}},Ne=function(t){return t},ss="%{",gs=I("%{",!1),Q="}",te=I("}",!1),hs=function(t,n,o){return{type:"ternary",variable:t.length>0?t:null,valueTest:n,...o,location:ws().start}},ts="=",He=I("=",!1),ds=function(t){return t},Ve="|",Ie=I("|",!1),Bs=function(t,n){return{type:"ternary",trueExpression:t,falseExpression:n,location:ws().start}},js=function(t){return t},Ke=/^[a-zA-Z0-9\-_]/,qe=me([["a","z"],["A","Z"],["0","9"],"-","_"],!1,!1),v="%",oe=I("%",!1),se="{",z=I("{",!1),Ue=function(){return{type:"char",char:"%"}},H=function(){return{type:"char",char:"]"}},Re=function(){return{type:"char",char:"|"}},Ye=function(){return{type:"char",char:"}"}},gt=/^[^|[\]\\{}%#\r\n\t ]/,ht=me(["|","[","]","\\","{","}","%","#","\r",`
`,"	"," "],!0,!1),bs=function(){return{type:"char",char:"\\"}},pe=function(){return{type:"char",char:"["}},$e=function(){return{type:"char",char:"{"}},dt=function(){return{type:"char",char:"#"}},Ps=" ",rs=I(" ",!1),ps=function(){return{type:"char",char:s!=null&&s.softLineBreaks?"\xA0":" "}},Ge="chord",ee=I("chord",!1),$s="define",xs=I("define",!1),is=":",ys=I(":",!1),ks=function(t,n,o){let{text:c,...g}=o;return{type:"tag",name:t,value:c,chordDefinition:g,location:ws().start,selector:n==null?void 0:n.value,isNegated:n==null?void 0:n.isNegated}},Ns=function(t,n,o){return vr(t,o,n,ws())},Cs="-",Is=I("-",!1),Rs=function(t,n){return{value:t,isNegated:!!n}},_s="!",As=I("!",!1),zs=function(){return!0},Os=function(t){return t},ns=function(t){return{value:t}},Ws=function(t){return{attributes:t}},_e=function(t){let n={};return t.forEach(o=>{n[o[0]]=o[1]}),n},Xe=function(t){return t},Hs=function(t,n){return[t,n]},m=/^[a-zA-Z_]/,O=me([["a","z"],["A","Z"],"_"],!1,!1),we=function(t){return t.map(n=>n.char||n).join("")},d=/^[^}\\\r\n]/,C=me(["}","\\","\r",`
`],!0,!1),L=/^[a-zA-Z\-_]/,B=me([["a","z"],["A","Z"],"-","_"],!1,!1),ue='"',Ae=I('"',!1),xe=function(t){return t},Di=/^[^"}]/,q=me(['"',"}"],!0,!1),as=function(){return{type:"char",char:'"'}},fr="frets",lr=I("frets",!1),ur=function(t,n,o,c){return{name:t,baseFret:n||1,frets:o,fingers:c,text:fo()}},bt="/",os=I("/",!1),R=/^[A-Ga-g]/,mr=me([["A","G"],["a","g"]],!1,!1),pt=/^[b#\u266D\u266F]/,$t=me(["b","#","\u266D","\u266F"],!1,!1),ve="es",xt=I("es",!1),yt="s",Ct=I("s",!1),Vs="is",At=I("is",!1),St=/^[a-zA-Z0-9#\u266Fb\u266D()+\-\/\xF8\u0394\u2212]/,Ks=me([["a","z"],["A","Z"],["0","9"],"#","\u266F","b","\u266D","(",")","+","-","/","\xF8","\u0394","\u2212"],!1,!1),qs="base-fret",Et=I("base-fret",!1),Ft=function(t){return t},Us="fingers",Lt=I("fingers",!1),wt=function(t){return t},Ss=function(t){return t},gr=/^[\-A-Za-z]/,vt=me(["-",["A","Z"],["a","z"]],!1,!1),u=/^[0-9]/,p=me([["0","9"]],!1,!1),E=function(t){return parseInt(t,10)},M=function(t){return t},N="0",Ta=I("0",!1),Ma=function(){return 0},Ti="-1",Ga=I("-1",!1),Ba=/^[NXnx]/,ja=me(["N","X","n","x"],!1,!1),Es=function(t,n,o){return Bf(t,o,n)},Mi="start_of_abc",Pa=I("start_of_abc",!1),Fs=function(t,n,o){return vr(t,o,n,ws())},Gi="end_of_abc",ka=I("end_of_abc",!1),Ls=function(t){return vr(t,null,null,ws())},Bi="start_of_grid",Na=I("start_of_grid",!1),ji="sog",Ia=I("sog",!1),Pi="end_of_grid",Ra=I("end_of_grid",!1),ki="eog",_a=I("eog",!1),Ni="start_of_ly",za=I("start_of_ly",!1),Ii="end_of_ly",Oa=I("end_of_ly",!1),Ri="start_of_svg",Wa=I("start_of_svg",!1),_i="end_of_svg",Ha=I("end_of_svg",!1),zi="start_of_tab",Va=I("start_of_tab",!1),Oi="sot",Ka=I("sot",!1),Wi="end_of_tab",qa=I("end_of_tab",!1),Hi="eot",Ua=I("eot",!1),Vi="start_of_textblock",Ya=I("start_of_textblock",!1),Ki="end_of_textblock",Xa=I("end_of_textblock",!1),Za=lo(),Ja=Mt("whitespace"),Qa=Mt("optional whitespace"),eo=/^[ \t\n\r]/,so=me([" ","	",`
`,"\r"],!1,!1),to=Mt("space"),qi=/^[ \t]/,Ui=me([" ","	"],!1,!1),ro=/^[\n\r]/,io=me([`
`,"\r"],!1,!1),no=`
`,ao=I(`
`,!1),oo="\r",co=I("\r",!1),i=0,G=0,Dt=[{line:1,column:1}],Be=0,hr=[],y=0,Tt;if(s.startRule!==void 0){if(!(s.startRule in f))throw new Error(`Can't start parsing from rule "`+s.startRule+'".');l=f[s.startRule]}function fo(){return r.substring(G,i)}function ws(){return Ys(G,i)}function Ml(t,n){throw n=n!==void 0?n:Ys(G,i),Xi([Mt(t)],r.substring(G,i),n)}function Gl(t,n){throw n=n!==void 0?n:Ys(G,i),mo(t,n)}function I(t,n){return{type:"literal",text:t,ignoreCase:n}}function me(t,n,o){return{type:"class",parts:t,inverted:n,ignoreCase:o}}function lo(){return{type:"any"}}function uo(){return{type:"end"}}function Mt(t){return{type:"other",description:t}}function Yi(t){let n=Dt[t],o;if(n)return n;for(o=t-1;!Dt[o];)o--;for(n=Dt[o],n={line:n.line,column:n.column};o<t;)r.charCodeAt(o)===10?(n.line++,n.column=1):n.column++,o++;return Dt[t]=n,n}function Ys(t,n){let o=Yi(t),c=Yi(n);return{source:a,start:{offset:t,line:o.line,column:o.column},end:{offset:n,line:c.line,column:c.column}}}function F(t){i<Be||(i>Be&&(Be=i,hr=[]),hr.push(t))}function mo(t,n){return new rt(t,[],"",n)}function Xi(t,n,o){return new rt(rt.buildMessage(t,n),t,n,o)}function Zi(){let t,n,o;for(t=i,n=[],o=Ji();o!==e;)n.push(o),o=Ji();return n!==e?(o=Qi(),o===e&&(o=null),o!==e?(G=t,n=h(n,o),t=n):(i=t,t=e)):(i=t,t=e),t}function Ji(){let t,n,o;return t=i,n=Qi(),n!==e?(o=ls(),o!==e?(G=t,n=S(n),t=n):(i=t,t=e)):(i=t,t=e),t}function Qi(){let t;return t=qo(),t===e&&(t=go()),t}function go(){let t,n,o,c,g,b,$;if(t=i,n=i,o=Gt(),o===e&&(o=null),o!==e?n=r.substring(n,i):n=o,n!==e){for(o=[],c=en();c!==e;)o.push(c),c=en();if(o!==e)if(c=tn(),c===e&&(c=null),c!==e)if(g=ho(),g===e&&(g=null),g!==e){for(b=[],$=ze();$!==e;)b.push($),$=ze();b!==e?(G=t,n=D(n,o,c,g),t=n):(i=t,t=e)}else i=t,t=e;else i=t,t=e;else i=t,t=e}else i=t,t=e;return t}function en(){let t,n;return t=Eo(),t===e&&(t=Fo(),t===e&&(t=bo(),t===e&&(t=po(),t===e&&(t=dr(),t===e&&(t=i,n=Gt(),n!==e&&(G=t,n=A(n)),t=n))))),t}function ho(){let t,n,o,c,g,b;if(t=i,n=ze(),n===e&&(n=null),n!==e)if(r.charCodeAt(i)===35?(o=x,i++):(o=e,y===0&&F(w)),o!==e){for(c=i,g=[],P.test(r.charAt(i))?(b=r.charAt(i),i++):(b=e,y===0&&F(j));b!==e;)g.push(b),P.test(r.charAt(i))?(b=r.charAt(i),i++):(b=e,y===0&&F(j));g!==e?c=r.substring(c,i):c=g,c!==e?(G=t,n=X(c),t=n):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function bo(){let t,n,o,c,g,b;if(t=i,n=$o(),n!==e){for(o=i,c=[],g=Gt();g!==e;)c.push(g),g=Gt();if(c!==e?o=r.substring(o,i):o=c,o!==e){for(c=i,g=[],b=ze();b!==e;)g.push(b),b=ze();g!==e?c=r.substring(c,i):c=g,c!==e?(G=t,n=ie(n,o,c),t=n):(i=t,t=e)}else i=t,t=e}else i=t,t=e;return t}function po(){let t,n,o,c,g,b;if(t=i,n=tn(),n!==e){for(o=[],c=br();c!==e;)o.push(c),c=br();if(o!==e){for(c=i,g=[],b=ze();b!==e;)g.push(b),b=ze();g!==e?c=r.substring(c,i):c=g,c!==e?(G=t,n=U(n,o,c),t=n):(i=t,t=e)}else i=t,t=e}else i=t,t=e;return t}function Gt(){let t,n,o;if(t=i,n=[],o=sn(),o!==e)for(;o!==e;)n.push(o),o=sn();else n=e;return n!==e&&(G=t,n=V(n)),t=n,t}function sn(){let t;return t=br(),t===e&&(t=ze()),t}function $o(){let t,n,o,c,g;if(t=i,n=i,y++,o=Ds(),y--,o===e?n=void 0:(i=n,n=e),n!==e)if(r.substr(i,2)===W?(o=W,i+=2):(o=e,y===0&&F(K)),o!==e){if(c=[],g=Bt(),g!==e)for(;g!==e;)c.push(g),g=Bt();else c=e;c!==e?(r.charCodeAt(i)===93?(g=Y,i++):(g=e,y===0&&F(Z)),g!==e?(G=t,n=be(c),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function tn(){let t,n,o,c,g;if(t=i,n=i,y++,o=Ds(),y--,o===e?n=void 0:(i=n,n=e),n!==e)if(r.charCodeAt(i)===91?(o=Ce,i++):(o=e,y===0&&F(Le)),o!==e){for(c=[],g=Bt();g!==e;)c.push(g),g=Bt();c!==e?(r.charCodeAt(i)===93?(g=Y,i++):(g=e,y===0&&F(Z)),g!==e?(G=t,n=ce(c),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function Bt(){let t,n,o,c;return J.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&F(fe)),t===e&&(t=i,n=Ds(),n!==e?(o=i,r.charCodeAt(i)===92?(c=ae,i++):(c=e,y===0&&F(de)),c!==e&&(G=o,c=ke()),o=c,o===e&&(o=i,r.charCodeAt(i)===93?(c=Y,i++):(c=e,y===0&&F(Z)),c!==e&&(G=o,c=Gs()),o=c),o!==e?(G=t,n=Ne(o),t=n):(i=t,t=e)):(i=t,t=e)),t}function dr(){let t,n,o,c,g,b,$,T,_;return t=i,r.substr(i,2)===ss?(n=ss,i+=2):(n=e,y===0&&F(gs)),n!==e?(o=k(),o!==e?(c=i,g=So(),g===e&&(g=null),g!==e?c=r.substring(c,i):c=g,c!==e?(g=xo(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=Co(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(_=Q,i++):(_=e,y===0&&F(te)),_!==e?(G=t,n=hs(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function xo(){let t,n,o,c;return t=i,r.charCodeAt(i)===61?(n=ts,i++):(n=e,y===0&&F(He)),n!==e?(o=k(),o!==e?(c=yo(),c!==e?(G=t,n=ds(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function yo(){let t,n,o;if(t=i,n=[],o=vs(),o!==e)for(;o!==e;)n.push(o),o=vs();else n=e;return n!==e?t=r.substring(t,i):t=n,t}function Co(){let t,n,o,c,g,b,$;return t=i,r.charCodeAt(i)===124?(n=Ve,i++):(n=e,y===0&&F(Ie)),n!==e?(o=k(),o!==e?(c=rn(),c!==e?(g=k(),g!==e?(b=Ao(),b===e&&(b=null),b!==e?($=k(),$!==e?(G=t,n=Bs(c,b),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Ao(){let t,n,o,c;return t=i,r.charCodeAt(i)===124?(n=Ve,i++):(n=e,y===0&&F(Ie)),n!==e?(o=k(),o!==e?(c=rn(),c!==e?(G=t,n=js(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function So(){let t,n;if(t=[],Ke.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&F(qe)),n!==e)for(;n!==e;)t.push(n),Ke.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&F(qe));else t=e;return t}function rn(){let t,n,o,c;if(t=[],n=i,o=[],c=vs(),c!==e)for(;c!==e;)o.push(c),c=vs();else o=e;if(o!==e?n=r.substring(n,i):n=o,n===e&&(n=dr()),n!==e)for(;n!==e;){if(t.push(n),n=i,o=[],c=vs(),c!==e)for(;c!==e;)o.push(c),c=vs();else o=e;o!==e?n=r.substring(n,i):n=o,n===e&&(n=dr())}else t=e;return t}function br(){let t,n,o,c;return t=nn(),t===e&&(t=i,r.charCodeAt(i)===37?(n=v,i++):(n=e,y===0&&F(oe)),n!==e?(o=i,y++,r.charCodeAt(i)===123?(c=se,i++):(c=e,y===0&&F(z)),y--,c===e?o=void 0:(i=o,o=e),o!==e?(G=t,n=Ue(),t=n):(i=t,t=e)):(i=t,t=e),t===e&&(t=i,r.charCodeAt(i)===93?(n=Y,i++):(n=e,y===0&&F(Z)),n!==e&&(G=t,n=H()),t=n,t===e&&(t=i,r.charCodeAt(i)===124?(n=Ve,i++):(n=e,y===0&&F(Ie)),n!==e&&(G=t,n=Re()),t=n,t===e&&(t=i,r.charCodeAt(i)===125?(n=Q,i++):(n=e,y===0&&F(te)),n!==e&&(G=t,n=Ye()),t=n)))),t}function vs(){let t;return t=nn(),t===e&&(t=ze()),t}function nn(){let t,n,o,c;return gt.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&F(ht)),t===e&&(t=i,n=Ds(),n!==e?(o=i,r.charCodeAt(i)===92?(c=ae,i++):(c=e,y===0&&F(de)),c!==e&&(G=o,c=bs()),o=c,o===e&&(o=i,r.charCodeAt(i)===124?(c=Ve,i++):(c=e,y===0&&F(Ie)),c!==e&&(G=o,c=Re()),o=c,o===e&&(o=i,r.charCodeAt(i)===91?(c=Ce,i++):(c=e,y===0&&F(Le)),c!==e&&(G=o,c=pe()),o=c,o===e&&(o=i,r.charCodeAt(i)===93?(c=Y,i++):(c=e,y===0&&F(Z)),c!==e&&(G=o,c=H()),o=c,o===e&&(o=i,r.charCodeAt(i)===123?(c=se,i++):(c=e,y===0&&F(z)),c!==e&&(G=o,c=$e()),o=c,o===e&&(o=i,r.charCodeAt(i)===125?(c=Q,i++):(c=e,y===0&&F(te)),c!==e&&(G=o,c=Ye()),o=c,o===e&&(o=i,r.charCodeAt(i)===37?(c=v,i++):(c=e,y===0&&F(oe)),c!==e&&(G=o,c=Ue()),o=c,o===e&&(o=i,r.charCodeAt(i)===35?(c=x,i++):(c=e,y===0&&F(w)),c!==e&&(G=o,c=dt()),o=c,o===e&&(o=i,r.charCodeAt(i)===32?(c=Ps,i++):(c=e,y===0&&F(rs)),c!==e&&(G=o,c=ps()),o=c)))))))),o!==e?(G=t,n=Ne(o),t=n):(i=t,t=e)):(i=t,t=e)),t}function Eo(){let t,n,o,c,g,b,$,T,_,hn,Sr;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,5)===Ge?(c=Ge,i+=5):(c=e,y===0&&F(ee)),c===e&&(r.substr(i,6)===$s?(c=$s,i+=6):(c=e,y===0&&F(xs))),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?(r.charCodeAt(i)===58?($=is,i++):($=e,y===0&&F(ys)),$!==e?(T=k(),T!==e?(_=Po(),_!==e?(hn=k(),hn!==e?(r.charCodeAt(i)===125?(Sr=Q,i++):(Sr=e,y===0&&F(te)),Sr!==e?(G=t,n=ks(c,g,_),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Fo(){let t,n,o,c,g,b,$,T;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(c=i,g=Go(),g!==e?c=r.substring(c,i):c=g,c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=cs(),b===e&&(b=vo()),b===e&&(b=null),b!==e?($=k(),$!==e?(r.charCodeAt(i)===125?(T=Q,i++):(T=e,y===0&&F(te)),T!==e?(G=t,n=Ns(c,g,b),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Ze(){let t,n,o,c;return t=i,r.charCodeAt(i)===45?(n=Cs,i++):(n=e,y===0&&F(Is)),n!==e?(o=wo(),o!==e?(c=Lo(),c===e&&(c=null),c!==e?(G=t,n=Rs(o,c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Lo(){let t,n;return t=i,r.charCodeAt(i)===33?(n=_s,i++):(n=e,y===0&&F(As)),n!==e&&(G=t,n=zs()),t=n,t}function wo(){let t,n,o;if(t=i,n=[],Ke.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(qe)),o!==e)for(;o!==e;)n.push(o),Ke.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(qe));else n=e;return n!==e?t=r.substring(t,i):t=n,t}function cs(){let t,n,o,c;return t=i,n=k(),n!==e?(r.charCodeAt(i)===58?(o=is,i++):(o=e,y===0&&F(ys)),o!==e?(c=Do(),c!==e?(G=t,n=Os(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function vo(){let t,n,o;return t=i,n=fs(),n!==e?(o=on(),o!==e?(G=t,n=ns(o),t=n):(i=t,t=e)):(i=t,t=e),t}function Do(){let t,n;return t=i,n=To(),n!==e&&(G=t,n=Ws(n)),t=n,t===e&&(t=i,n=on(),n!==e&&(G=t,n=ns(n)),t=n),t}function To(){let t,n,o;if(t=i,n=[],o=an(),o!==e)for(;o!==e;)n.push(o),o=an();else n=e;return n!==e&&(G=t,n=_e(n)),t=n,t}function an(){let t,n,o;return t=i,n=fs(),n!==e?(o=Mo(),o!==e?(G=t,n=Xe(o),t=n):(i=t,t=e)):(i=t,t=e),t}function Mo(){let t,n,o,c,g,b;return t=i,n=Bo(),n!==e?(o=k(),o!==e?(r.charCodeAt(i)===61?(c=ts,i++):(c=e,y===0&&F(He)),c!==e?(g=k(),g!==e?(b=jo(),b!==e?(G=t,n=Hs(n,b),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Go(){let t,n;if(t=[],m.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&F(O)),n!==e)for(;n!==e;)t.push(n),m.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&F(O));else t=e;return t}function on(){let t,n,o,c;if(t=i,n=k(),n!==e){for(o=[],c=cn();c!==e;)o.push(c),c=cn();o!==e?(G=t,n=we(o),t=n):(i=t,t=e)}else i=t,t=e;return t}function cn(){let t,n,o,c;return d.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&F(C)),t===e&&(t=i,n=Ds(),n!==e?(o=i,r.charCodeAt(i)===92?(c=ae,i++):(c=e,y===0&&F(de)),c!==e&&(G=o,c=bs()),o=c,o===e&&(o=i,r.charCodeAt(i)===125?(c=Q,i++):(c=e,y===0&&F(te)),c!==e&&(G=o,c=Ye()),o=c,o===e&&(o=i,r.charCodeAt(i)===123?(c=se,i++):(c=e,y===0&&F(z)),c!==e&&(G=o,c=$e()),o=c)),o!==e?(G=t,n=Ne(o),t=n):(i=t,t=e)):(i=t,t=e)),t}function Bo(){let t,n,o;if(t=i,n=[],L.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(B)),o!==e)for(;o!==e;)n.push(o),L.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(B));else n=e;return n!==e?t=r.substring(t,i):t=n,t}function jo(){let t,n,o,c,g;if(t=i,r.charCodeAt(i)===34?(n=ue,i++):(n=e,y===0&&F(Ae)),n!==e){for(o=i,c=[],g=fn();g!==e;)c.push(g),g=fn();c!==e?o=r.substring(o,i):o=c,o!==e?(r.charCodeAt(i)===34?(c=ue,i++):(c=e,y===0&&F(Ae)),c!==e?(G=t,n=xe(o),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;return t}function fn(){let t,n,o,c;return Di.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&F(q)),t===e&&(t=i,n=Ds(),n!==e?(o=i,r.charCodeAt(i)===92?(c=ae,i++):(c=e,y===0&&F(de)),c!==e&&(G=o,c=bs()),o=c,o===e&&(o=i,r.charCodeAt(i)===125?(c=Q,i++):(c=e,y===0&&F(te)),c!==e&&(G=o,c=Ye()),o=c,o===e&&(o=i,r.charCodeAt(i)===34?(c=ue,i++):(c=e,y===0&&F(Ae)),c!==e&&(G=o,c=as()),o=c)),o!==e?(G=t,n=Ne(o),t=n):(i=t,t=e)):(i=t,t=e)),t}function Po(){let t,n,o,c,g,b,$;if(t=i,n=ko(),n!==e)if(o=k(),o!==e)if(c=_o(),c===e&&(c=null),c!==e)if(r.substr(i,5)===fr?(g=fr,i+=5):(g=e,y===0&&F(lr)),g!==e){if(b=[],$=mn(),$!==e)for(;$!==e;)b.push($),$=mn();else b=e;b!==e?($=zo(),$===e&&($=null),$!==e?(G=t,n=ur(n,c,b,$),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;else i=t,t=e;else i=t,t=e;return t}function ko(){let t,n,o,c;return t=i,n=i,o=No(),o!==e?(c=Io(),c===e&&(c=null),c!==e?(o=[o,c],n=o):(i=n,n=e)):(i=n,n=e),n!==e?t=r.substring(t,i):t=n,t}function No(){let t,n,o,c;return t=i,n=i,o=ln(),o!==e?(c=Ro(),c===e&&(c=null),c!==e?(o=[o,c],n=o):(i=n,n=e)):(i=n,n=e),n!==e?t=r.substring(t,i):t=n,t}function Io(){let t,n,o,c;return t=i,n=i,r.charCodeAt(i)===47?(o=bt,i++):(o=e,y===0&&F(os)),o!==e?(c=ln(),c!==e?(o=[o,c],n=o):(i=n,n=e)):(i=n,n=e),n!==e?t=r.substring(t,i):t=n,t}function ln(){let t,n,o,c;return t=i,n=i,R.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(mr)),o!==e?(pt.test(r.charAt(i))?(c=r.charAt(i),i++):(c=e,y===0&&F($t)),c===e&&(r.substr(i,2)===ve?(c=ve,i+=2):(c=e,y===0&&F(xt)),c===e&&(r.charCodeAt(i)===115?(c=yt,i++):(c=e,y===0&&F(Ct)),c===e&&(r.substr(i,2)===Vs?(c=Vs,i+=2):(c=e,y===0&&F(At))))),c===e&&(c=null),c!==e?(o=[o,c],n=o):(i=n,n=e)):(i=n,n=e),n!==e?t=r.substring(t,i):t=n,t}function Ro(){let t,n,o;if(t=i,n=[],St.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(Ks)),o!==e)for(;o!==e;)n.push(o),St.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(Ks));else n=e;return n!==e?t=r.substring(t,i):t=n,t}function _o(){let t,n,o,c,g;return t=i,r.substr(i,9)===qs?(n=qs,i+=9):(n=e,y===0&&F(Et)),n!==e?(o=fs(),o!==e?(c=gn(),c!==e?(g=fs(),g!==e?(G=t,n=Ft(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function zo(){let t,n,o,c,g;if(t=i,n=fs(),n!==e)if(r.substr(i,7)===Us?(o=Us,i+=7):(o=e,y===0&&F(Lt)),o!==e){if(c=[],g=un(),g!==e)for(;g!==e;)c.push(g),g=un();else c=e;c!==e?(G=t,n=wt(c),t=n):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function un(){let t,n,o;return t=i,n=fs(),n!==e?(o=Oo(),o!==e?(G=t,n=Ss(o),t=n):(i=t,t=e)):(i=t,t=e),t}function Oo(){let t;return t=Wo(),t===e&&(gr.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&F(vt))),t}function Wo(){let t,n;return t=i,u.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&F(p)),n!==e&&(G=t,n=E(n)),t=n,t}function mn(){let t,n,o;return t=i,n=fs(),n!==e?(o=Ho(),o!==e?(G=t,n=M(o),t=n):(i=t,t=e)):(i=t,t=e),t}function Ho(){let t,n,o;return t=i,n=k(),n!==e?(o=gn(),o===e&&(o=Vo(),o===e&&(o=Ko())),o!==e?(G=t,n=M(o),t=n):(i=t,t=e)):(i=t,t=e),t}function gn(){let t,n;return t=i,u.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&F(p)),n!==e&&(G=t,n=E(n)),t=n,t}function Vo(){let t,n;return t=i,r.charCodeAt(i)===48?(n=N,i++):(n=e,y===0&&F(Ta)),n!==e&&(G=t,n=Ma()),t=n,t}function Ko(){let t;return r.substr(i,2)===Ti?(t=Ti,i+=2):(t=e,y===0&&F(Ga)),t===e&&(Ba.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&F(ja))),t}function qo(){let t;return t=Uo(),t===e&&(t=Xo(),t===e&&(t=Jo(),t===e&&(t=ec(),t===e&&(t=tc(),t===e&&(t=ic()))))),t}function Uo(){let t,n,o,c,g,b,$,T;if(t=i,n=Yo(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=pr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=pr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=pr(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function Yo(){let t,n,o,c,g,b,$,T,_;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,12)===Mi?(c=Mi,i+=12):(c=e,y===0&&F(Pa)),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(_=Q,i++):(_=e,y===0&&F(te)),_!==e?(G=t,n=Fs(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function pr(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,10)===Gi?(c=Gi,i+=10):(c=e,y===0&&F(ka)),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=Q,i++):(b=e,y===0&&F(te)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Xo(){let t,n,o,c,g,b,$,T;if(t=i,n=Zo(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=$r(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=$r(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=$r(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function Zo(){let t,n,o,c,g,b,$,T,_;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,13)===Bi?(c=Bi,i+=13):(c=e,y===0&&F(Na)),c===e&&(r.substr(i,3)===ji?(c=ji,i+=3):(c=e,y===0&&F(Ia))),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(_=Q,i++):(_=e,y===0&&F(te)),_!==e?(G=t,n=Fs(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function $r(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,11)===Pi?(c=Pi,i+=11):(c=e,y===0&&F(Ra)),c===e&&(r.substr(i,3)===ki?(c=ki,i+=3):(c=e,y===0&&F(_a))),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=Q,i++):(b=e,y===0&&F(te)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Jo(){let t,n,o,c,g,b,$,T;if(t=i,n=Qo(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=xr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=xr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=xr(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function Qo(){let t,n,o,c,g,b,$,T,_;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,11)===Ni?(c=Ni,i+=11):(c=e,y===0&&F(za)),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(_=Q,i++):(_=e,y===0&&F(te)),_!==e?(G=t,n=Fs(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function xr(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,9)===Ii?(c=Ii,i+=9):(c=e,y===0&&F(Oa)),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=Q,i++):(b=e,y===0&&F(te)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function ec(){let t,n,o,c,g,b,$,T;if(t=i,n=sc(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=yr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=yr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=yr(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function sc(){let t,n,o,c,g,b,$,T,_;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,12)===Ri?(c=Ri,i+=12):(c=e,y===0&&F(Wa)),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(_=Q,i++):(_=e,y===0&&F(te)),_!==e?(G=t,n=Fs(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function yr(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,10)===_i?(c=_i,i+=10):(c=e,y===0&&F(Ha)),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=Q,i++):(b=e,y===0&&F(te)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function tc(){let t,n,o,c,g,b,$,T;if(t=i,n=rc(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=Cr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=Cr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=Cr(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function rc(){let t,n,o,c,g,b,$,T,_;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,12)===zi?(c=zi,i+=12):(c=e,y===0&&F(Va)),c===e&&(r.substr(i,3)===Oi?(c=Oi,i+=3):(c=e,y===0&&F(Ka))),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(_=Q,i++):(_=e,y===0&&F(te)),_!==e?(G=t,n=Fs(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Cr(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,10)===Wi?(c=Wi,i+=10):(c=e,y===0&&F(qa)),c===e&&(r.substr(i,3)===Hi?(c=Hi,i+=3):(c=e,y===0&&F(Ua))),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=Q,i++):(b=e,y===0&&F(te)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function ic(){let t,n,o,c,g,b,$,T;if(t=i,n=nc(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=Ar(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=Ar(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=Ar(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function nc(){let t,n,o,c,g,b,$,T,_;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,18)===Vi?(c=Vi,i+=18):(c=e,y===0&&F(Ya)),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(_=Q,i++):(_=e,y===0&&F(te)),_!==e?(G=t,n=Fs(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Ar(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=se,i++):(n=e,y===0&&F(z)),n!==e?(o=k(),o!==e?(r.substr(i,16)===Ki?(c=Ki,i+=16):(c=e,y===0&&F(Xa)),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=Q,i++):(b=e,y===0&&F(te)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Se(){let t;return r.length>i?(t=r.charAt(i),i++):(t=e,y===0&&F(Za)),t}function fs(){let t,n;if(y++,t=[],n=jt(),n!==e)for(;n!==e;)t.push(n),n=jt();else t=e;return y--,t===e&&(n=e,y===0&&F(Ja)),t}function k(){let t,n;for(y++,t=[],n=jt();n!==e;)t.push(n),n=jt();return y--,t===e&&(n=e,y===0&&F(Qa)),t}function jt(){let t;return eo.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&F(so)),t}function ze(){let t,n,o;if(y++,t=i,n=[],qi.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(Ui)),o!==e)for(;o!==e;)n.push(o),qi.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&F(Ui));else n=e;return n!==e?t=r.substring(t,i):t=n,y--,t===e&&(n=e,y===0&&F(to)),t}function ls(){let t;return ro.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&F(io)),t===e&&(t=ac()),t}function ac(){let t,n,o;return t=i,n=cc(),n!==e?(o=oc(),o!==e?(n=[n,o],t=n):(i=t,t=e)):(i=t,t=e),t}function oc(){let t;return r.charCodeAt(i)===10?(t=no,i++):(t=e,y===0&&F(ao)),t}function cc(){let t;return r.charCodeAt(i)===13?(t=oo,i++):(t=e,y===0&&F(co)),t}function Ds(){let t;return r.charCodeAt(i)===92?(t=ae,i++):(t=e,y===0&&F(de)),t}if(Tt=l(),Tt!==e&&i===r.length)return Tt;throw Tt!==e&&i<r.length&&F(uo()),Xi(hr,Be<r.length?r.charAt(Be):null,Be<r.length?Ys(Be,Be+1):Ys(Be,Be))}var _f=Rf,fi=class{get warnings(){var s;return((s=this.song)==null?void 0:s.warnings)||[]}parse(s,e){var f;let a=_f(Cc(s),{tracer:new Mf,...e});return this.song=new Tf().deserialize(a,{notation:(f=e==null?void 0:e.notation)!=null?f:null}),this.song}},tr=fi;var it="b|i|u|s|tt|big|small|sub|sup|span|strut|sym",jl=new RegExp(`<(?:\\/(?:${it})>|(?:${it})(?:\\s[^>]*)?\\/?>)`,"g");var Pl=new RegExp(`<(${it})(\\s[^>]*)?\\/>|<(${it})(\\s[^>]*)?>|<\\/(${it})>`,"g");var kl={[ct]:sr,[Ts]:ut,[ot]:er,[Zt]:at},Nl={[ct]:$i,[Ts]:Qt,[ot]:pi,[Zt]:zt};var Pe=null;var Fi=()=>{var r;return(r=globalThis.__DEV__)!=null?r:!1},rr={debug:(...r)=>{Fi()&&console.debug(...r)},info:(...r)=>{Fi()&&console.info(...r)},log:(...r)=>{Fi()&&console.log(...r)},warn:(...r)=>{var s;console.warn(...r),(s=Pe==null?void 0:Pe.warn)==null||s.call(Pe,...r)},error:(...r)=>{var s;console.error(...r),(s=Pe==null?void 0:Pe.error)==null||s.call(Pe,...r)}};var ge={primary:"#253883",secondary:"#95d2f2",accent:"#E15C62",info:"#31AADF",green:"#A3BD31",yellow:"#FCD200",purple:"#9D1E74",text:"#002B81",background:"#ffffff",white:"#ffffff",black:"#000000",border:"#E0E0E0"};var ms={iosBlue:"#007AFF",chordBlue:"#007bff",chordSecondaryText:"#6c757d",accentYellow:"#f4c11e",modalOverlay:"rgba(0, 0, 0, 0.5)"},Li={light:{text:"#212529",title:"#1C1C1E",chord:ms.chordBlue,muted:ms.chordSecondaryText,label:"#5B6270",chorusBar:ms.accentYellow,chorusBg:"rgba(244, 193, 30, 0.07)",filler:"rgba(33, 37, 41, 0.25)"},dark:{text:"#E5E5EA",title:"#F5F5F7",chord:"#64B5F6",muted:"#98989D",label:"#AEAEB2",chorusBar:ms.accentYellow,chorusBg:"rgba(244, 193, 30, 0.08)",filler:"rgba(229, 229, 234, 0.28)"}};var _l={verde:{skin:"#4FA37A",skinDark:"#2E6B4F",outline:"#173A2A",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:"#E2342B",mohawkB:"#F2D43B",iris:"#5B86B5",mouth:"#E2342B"},celeste:{skin:ge.info,skinDark:"#1E7FAE",outline:"#0E3A55",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:ge.yellow,mohawkB:"#FFFFFF",iris:ge.primary,mouth:ge.accent},rojo:{skin:ge.accent,skinDark:"#A8383E",outline:"#4A1417",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:ge.yellow,mohawkB:"#FFFFFF",iris:ge.primary,mouth:"#7A1E22"},lima:{skin:ge.green,skinDark:"#6F8420",outline:"#2E3A0C",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:ge.purple,mohawkB:ge.yellow,iris:ge.primary,mouth:ge.accent},morado:{skin:ge.purple,skinDark:"#6A124E",outline:"#2E0822",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:ge.yellow,mohawkB:ge.secondary,iris:ge.secondary,mouth:ge.yellow},nocturno:{skin:"#2C2C3E",skinDark:"#16161F",outline:"#0A0A10",cap:"#44445A",capDark:"#30303F",mohawkA:"#5AE08A",mohawkB:"#9DE86B",iris:"#9DE86B",mouth:"#5AE08A"},dorado:{skin:"#E3B341",skinDark:"#B08423",outline:"#4A3508",cap:"#8A6A1E",capDark:"#6B5217",mohawkA:"#FFF3B0",mohawkB:"#FFFFFF",iris:"#6B5217",mouth:"#B08423"},silueta:{skin:"#8E8E93",skinDark:"#8E8E93",outline:"#636366",cap:"#8E8E93",capDark:"#8E8E93",mohawkA:"#8E8E93",mohawkB:"#8E8E93",iris:"#8E8E93",mouth:"#8E8E93"}};var zf={A:"LA",B:"SI",C:"DO",D:"RE",E:"MI",F:"FA",G:"SOL"};function ir(r,s){if(s==="EN")return r;let e=r.replace(/(^|[\\/|-])([A-G])/g,(f,l,h)=>l+(zf[h]||h));return/[A-G][#b]?m(?![a-z])/i.test(r)?e.toLowerCase():e}var pa=new Map;function Of(r){if(!r)return r;let s=r[0],e=r.slice(1).replace(/^B/,"b").replace(/M/g,"m");return s+e}function $a(r,s){if(!r)return"";let e=r.toUpperCase();if(!s)return e;let a=`${e}|${s}`,f=pa.get(a);if(f)return f;try{let l=Of(e),S=new tr().parse(`{key: ${l}}
[${l}]`).transpose(s);for(let D of S.lines)for(let A of D.items)if(A instanceof Fe&&A.chords){let x=A.chords.toUpperCase();return pa.set(a,x),x}}catch(l){rr.warn("transposeKey error",l)}return e}var nr="@@ARR@@";function xa(r){return r.replace(/\{\s*arr\s*:\s*([^}]*)\}/gi,(s,e)=>`{comment: ${nr}${e.trim()}}`)}var ar="@@CHORUS@@",Wf=/revis|pendiente|\bto ?do\b/i,Hf=/^(estribillo|coro|chorus)\b/i,Vf=/^(puente|pre-?estribillo|bridge)\b/i,Kf=/^(intro|instrumental|interludio|final|outro|solo)\b/i,qf=/^estrofa\s*(\d+)?\s*$/i,Uf=/^(\s*)(\d{1,2})\s*(?:[.)º°ª]|\.-)\s+/;function ya(r){return r.replace(/^[^\p{L}\p{N}]+/u,"").replace(/[^\p{L}\p{N}).]+$/u,"").trim()}function Yf(r){return r.replace(/&[a-z]+;|&#\d+;/gi," ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/\(?\s*\b(bis|x\s?\d+)\b\s*\)?/g," ").replace(/[^a-zñ0-9 ]+/g," ").replace(/\s+/g," ").trim()}function Xf(r,s){let e=r?r.split(" "):[],a=s?s.split(" "):[];if(e.length===0&&a.length===0)return 1;if(e.length===0||a.length===0)return 0;let f=Array.from({length:a.length+1},(l,h)=>h);for(let l=1;l<=e.length;l++){let h=[l];for(let S=1;S<=a.length;S++)h[S]=Math.min(f[S]+1,h[S-1]+1,f[S-1]+(e[l-1]===a[S-1]?0:1));f=h}return 1-f[a.length]/Math.max(e.length,a.length)}var Zf=.8;function or(r){return r.kind!=="lyrics"?"":r.atoms.map(s=>s.segs.map(e=>e.text).join("")).join("")}function Jf(r){return Yf(r.lines.map(or).join(" "))}function Qf(r){var f;let s=[],e=[],a=()=>{e.length&&s.push({segs:e}),e=[]};for(let{chord:l,text:h}of r)((f=h.match(/[^\s]+\s*|\s+/g))!=null?f:[""]).map(D=>D.replace(/\s+$/,A=>A?" ":"")).forEach((D,A)=>{let x=A===0?l:"";if(/^\s/.test(D)){if(e.length&&!x){e[e.length-1]={...e[e.length-1],text:e[e.length-1].text+D},a();return}a(),e.push({chord:x,text:D}),a();return}e.push({chord:x,text:D}),/\s$/.test(D)&&a()});a();for(let l=0;l<s.length-1;l++){let h=s[l],S=s[l+1],D=h.segs.length===1&&h.segs[0].chord&&h.segs[0].text.trim()==="",A=S.segs.some(x=>x.text.trim()!=="");if(D&&A&&!S.segs[0].chord){if(S.segs[0]={...S.segs[0],chord:h.segs[0].chord},l>0){let x=s[l-1],w=x.segs[x.segs.length-1];x.segs[x.segs.length-1]={...w,text:w.text.replace(/\s*$/," ")}}s.splice(l,1),l--}}for(;s.length&&s[0].segs.every(l=>!l.chord&&l.text.trim()==="");)s.shift();return s}var el=/^\(?\s*(estribillo|coro)\s*\)?\s*(\(?\s*(bis|x\s?\d+)\s*\)?)?\s*[.:]?$/i;function sl(r){return r.some(s=>s.chord)?!1:el.test(r.map(s=>s.text).join("").trim())}var tl=/^[\s|/\-–·.,()x×\d]*$/i;function rl(r,s){let e=Qf(r);if(e.length===0)return null;let a=r.map(l=>l.chord).filter(Boolean),f=r.map(l=>l.text).join("").trim();return a.length>0&&tl.test(f)?{kind:"chords",chords:a,note:f,src:s}:{kind:"lyrics",atoms:e,src:s}}function il(r){return!!r&&typeof r.name=="string"&&!("chords"in r)}function nl(r){return!!r&&typeof r.chords=="string"}var al=new Set(["comment","c","comment_italic","ci"]);function Sa(r,s){var X,ie,U;let e=[],a=[],f=!1,l=null,h="",S=null,D=0,A=(V,W,K)=>(l={kind:V,label:W,number:null,lines:[],repeatOf:null,breakBefore:D},D=0,h=K,e.push(l),l),x=()=>{l=null,h=""},w=V=>{let W=V==="chorus"?"chorus":V==="bridge"?"bridge":"verse";if(l&&h===V)return l;if(S){let K=S;S=null;let Y=W==="verse"?K.kind:W,Z=A(Y,K.label,V);return Z.number=K.number,Z}return A(W,null,V)},P=0;for(let V of r.paragraphs){if(x(),V.lines.length===0){P++;continue}D=e.length===0?0:P>=1?2:1,P=0;let W=V.label;for(let K of V.lines){let Y=(X=K.lineNumber)!=null?X:null,Z=K.type==="chorus"||K.type==="bridge"?K.type:"verse",be=[];for(let ce of K.items){if(nl(ce)){let ke=ce.annotation?ce.annotation:ce.chords?ir(ce.chords,s.notation):"";be.push({chord:ke,text:(ie=ce.lyrics)!=null?ie:""});continue}if(!il(ce))continue;let J=ce.name.toLowerCase(),fe=((U=ce.value)!=null?U:"").trim();if(!al.has(J)||!fe)continue;if(fe.startsWith(nr)){w(Z).lines.push({kind:"arr",text:fe.slice(nr.length).trim(),src:Y});continue}if(fe.startsWith(ar)){x();let ke=A("chorus",fe.slice(ar.length).trim()||null,"@ref");ke.repeatOf={index:-1,exact:!0,sameChords:!0},x();continue}if(Wf.test(fe)){a.push(ya(fe)||fe);continue}let ae=ya(fe),de=ae.match(qf);if(Hf.test(ae)&&ae.length<=24){x(),S={kind:"chorus",label:ae,number:null};continue}if(Vf.test(ae)&&ae.length<=24){x(),S={kind:"bridge",label:ae,number:null};continue}if(de){x(),S={kind:"verse",label:null,number:de[1]?Number(de[1]):null},de[1]&&(f=!0);continue}if(Kf.test(ae)&&!ae.includes(":")){x(),S={kind:"instrumental",label:ae,number:null};continue}w(Z).lines.push({kind:"comment",text:fe,src:Y})}if(be.length===0)continue;if(sl(be)){x();let ce=A("chorus",null,"@ref");ce.repeatOf={index:-1,exact:!0,sameChords:!0},x();continue}let Ce=rl(be,Y);if(!Ce)continue;let Le=w(Z);Z!=="verse"&&W&&Le.label===null&&(Le.label=W),Le.lines.push(Ce)}}S!=null&&S.label&&e.push({kind:"note",label:null,number:null,lines:[{kind:"comment",text:S.label,src:null}],repeatOf:null,breakBefore:1});let j=e.filter(V=>{var W;return V.lines.length>0||((W=V.repeatOf)==null?void 0:W.index)===-1});return gl(j),ml(j),f=hl(j)||f,dl(j),pl(j,f),{sections:j,reviewNotes:a,manualNumbers:f}}var ol=60,cl=70,fl=/[.,;:!?…)»"'”]\s*$/,ll=/^[a-záéíóúüñ]/;function ul(r,s){let e=r.trim().length;return ll.test(s.trim())?e>cl?!0:e>ol&&!fl.test(r):!1}function ml(r){for(let s of r){let e=[];for(let a of s.lines){let f=e[e.length-1];if((f==null?void 0:f.kind)==="lyrics"&&a.kind==="lyrics"&&ul(or(f),or(a))){let l=f.atoms[f.atoms.length-1],h=l.segs[l.segs.length-1];l.segs[l.segs.length-1]={...h,text:h.text.replace(/\s*$/," ")},f.atoms.push(...a.atoms);continue}e.push(a)}s.lines=e}}function gl(r){for(let s of r)s.kind!=="verse"||s.lines.some(a=>a.kind==="lyrics")||(s.kind=s.lines.some(a=>a.kind==="chords")?"instrumental":"note")}function hl(r){var e,a,f;let s=!1;for(let l of r){if(l.kind!=="verse")continue;let h=l.lines.find(w=>w.kind==="lyrics");if(!h||h.kind!=="lyrics"||!h.atoms[0])continue;let S=h.atoms[0].segs.map(w=>w.text).join(""),D=S.match(Uf);if(!D||S.trim().length>D[0].trim().length)continue;let A=(a=(e=h.atoms[0].segs.find(w=>w.chord))==null?void 0:e.chord)!=null?a:"";h.atoms.shift();let x=(f=h.atoms[0])==null?void 0:f.segs[0];A&&x&&!x.chord&&(h.atoms[0].segs[0]={...x,chord:A}),l.number=Number(D[2]),s=!0}return s}function dl(r){var h,S,D,A;let s=r.map(x=>{var w;return((w=x.repeatOf)==null?void 0:w.index)===-1?"":Jf(x)}),e=new Map;r.forEach((x,w)=>{var j;x.kind!=="verse"||x.lines.filter(X=>X.kind==="lyrics").length<2||s[w].length<12||e.set(s[w],[...(j=e.get(s[w]))!=null?j:[],w])});for(let x of e.values())if(!(x.length<2))for(let w of x)r[w].kind="chorus",r[w].inferred=!0;let a=r.map(bl),f=[],l=[];r.forEach((x,w)=>{var X;if(x.kind!=="chorus")return;if(((X=x.repeatOf)==null?void 0:X.index)===-1){l.push(w);return}let P=-1,j=0;for(let ie of f){let U=s[ie]===s[w]?1:Xf(s[ie],s[w]);U>j&&(P=ie,j=U)}if(P>=0&&j>=Zf){x.repeatOf={index:P,exact:s[P]===s[w],sameChords:a[P]===a[w]};return}f.push(w)});for(let x of l){let w=r[x],P=f.filter(X=>X<x),j=(S=(h=w.label?f.find(X=>r[X].label===w.label):void 0)!=null?h:P[P.length-1])!=null?S:f[0];if(j===void 0){w.repeatOf=null,w.kind="note",w.lines=[{kind:"comment",text:(D=w.label)!=null?D:"Estribillo",src:null}];continue}w.lines=r[j].lines,w.label=(A=w.label)!=null?A:r[j].label,w.repeatOf={index:j,exact:!0,sameChords:!0}}}function bl(r){return r.lines.map(s=>s.kind==="lyrics"?s.atoms.flatMap(e=>e.segs.map(a=>a.chord)).filter(Boolean).join(" "):s.kind==="chords"?s.chords.join(" "):"").join("|")}function pl(r,s){var f;let e=r.filter(l=>l.kind==="verse");if(e.length<2&&!s){e.forEach(l=>l.number=null);return}let a=0;for(let l of e)l.number=(f=l.number)!=null?f:a+1,a=l.number}var $l=/^\(?\s*(bis|x\s?\d+|\d+\s?veces)\s*\)?[.,;:]?\s*$/i;function xl(r,s=""){let e=r.segs.map(l=>l.text).join(""),a=$l.test(e)?"w bis":"w",f=r.segs.map((l,h)=>{let S=h<r.segs.length-1?" m":"",D=l.chord?`<b class="c">${l.chord}</b>`:"",A=/^\s+$/.test(l.text)?l.text.replace(/\s/g,"&#160;"):l.text;return`<span class="s${S}">${D}<span class="t">${A}</span></span>`}).join("");return`<span class="${a}">${s}${f}</span>`}function Ca(r,s,e){let a=e&&r.src!==null?` data-line="${r.src}"`:"";switch(r.kind){case"lyrics":{let f=r.atoms.some(h=>h.segs.some(S=>S.chord)),l=r.atoms.map((h,S)=>xl(h,S===0&&s!==null?`<span class="vn">${s}</span>`:"")).join("");return`<div class="ln ly${f?"":" nc"}"${a}>${l}</div>`}case"chords":{let f=r.chords.map(h=>`<b class="c">${h}</b>`).join(""),l=r.note?`<span class="cn">${r.note}</span>`:"";return`<div class="ln co"${a}>${f}${l}</div>`}case"comment":return`<div class="cm"${a}>${r.text}</div>`;case"arr":{let f=/^\s*\|/.test(r.text)?r.text:`| ${r.text}`;return`<div class="arrangement"${a}>${f}</div>`}}}var Aa={verse:"Estrofa",chorus:"Estribillo",bridge:"Puente",instrumental:"Instrumental",note:""};function wi(r,s){let e=r.kind==="verse"?r.number:null;return r.lines.map(a=>{if(a.kind==="lyrics"&&e!==null){let f=e;return e=null,Ca(a,f,s)}return Ca(a,null,s)}).join("")}function yl(r){let s=r.lines.find(e=>e.kind==="lyrics");return s?or(s).trim():""}function Ea(r,{lineNumbers:s=!1}={}){var l,h,S,D;let e=[],a=0,{sections:f}=r;for(;a<f.length;){let A=f[a],x=A.kind+(A.inferred?" inferred":"")+(A.breakBefore===2?" gap2":A.breakBefore===0?" gap0":""),w=(l=A.label)!=null?l:A.kind==="chorus"||A.kind==="bridge"?Aa[A.kind]:null;if(A.repeatOf){let j=1;for(;a+j<f.length&&((h=f[a+j].repeatOf)==null?void 0:h.index)===A.repeatOf.index&&((S=f[a+j].repeatOf)==null?void 0:S.exact)===A.repeatOf.exact&&((D=f[a+j].repeatOf)==null?void 0:D.sameChords)===A.repeatOf.sameChords;)j++;let X=w?`<div class="lbl">${w}</div>`:"",ie=f.slice(a,a+j).map(K=>`<div class="rep-one">${X}${wi(K,s)}</div>`).join(""),U=yl(A),W=`<details class="rep-fold"><summary><span class="lbl">${(w!=null?w:Aa[A.kind])+(j>1?` <span class="x">\xD7${j}</span>`:"")+(A.repeatOf.exact?A.repeatOf.sameChords?"":' <span class="x xc">otros acordes</span>':' <span class="x">con cambios</span>')}</span>`+(U?`<span class="pv">${U}</span>`:"")+`</summary>${wi(A,s)}</details>`;e.push(`<section class="sec ${x} rep"><div class="rep-full">${ie}</div>${W}</section>`),a+=j;continue}let P=w&&A.kind!=="verse"?`<div class="lbl">${w}</div>`:"";e.push(`<section class="sec ${x}">${P}${wi(A,s)}</section>`),a++}return`<div class="sheet">${e.join("")}</div>`}var vi=[{id:"negrita",name:"Negrita"},{id:"raya",name:"Raya"},{id:"mayus",name:"MAY\xDAS"},{id:"clasico",name:"Cl\xE1sico"},{id:"sangrado",name:"Sangrado"}],Fa=vi.map(r=>`ch-${r.id}`),Qe=Li.light,es=Li.dark,La=`
  body {
    --sh-text: ${Qe.text}; --sh-title: ${Qe.title}; --sh-chord: ${Qe.chord};
    --sh-muted: ${Qe.muted}; --sh-label: ${Qe.label};
    --sh-chorus-bar: ${Qe.chorusBar}; --sh-chorus-bg: ${Qe.chorusBg};
    --sh-filler: ${Qe.filler};
  }
  body.theme-dark {
    --sh-text: ${es.text}; --sh-title: ${es.title}; --sh-chord: ${es.chord};
    --sh-muted: ${es.muted}; --sh-label: ${es.label};
    --sh-chorus-bar: ${es.chorusBar}; --sh-chorus-bg: ${es.chorusBg};
    --sh-filler: ${es.filler};
  }
  .sheet {
    font-size: var(--song-font-size);
    color: var(--sh-text);
    margin-top: 0.4em;
    column-gap: 2.2em;
    column-rule: 1px solid var(--sh-filler);
    /* Ritmo vertical: el hueco dice qu\xE9 separa a dos cosas.
       - Un rengl\xF3n que contin\xFAa la misma l\xEDnea del .cho: pegado (0).
       - Otra l\xEDnea del .cho: --gap-line.
       - Una l\xEDnea en blanco: --gap-sec.
       - Dos o m\xE1s l\xEDneas en blanco, o entrar/salir de un estribillo:
         --gap-big (no el doble, pero se nota). */
    --gap-line: 0.34em;
    --gap-sec: 0.95em;
    --gap-big: 1.45em;
  }
  /* \xABM\xE1s aire\xBB: lo mismo, m\xE1s abierto. */
  body.airy .sheet { --gap-line: 0.5em; --gap-sec: 1.4em; --gap-big: 2.05em; }
  .sec { margin: 0; break-inside: avoid; position: relative; }
  .sec + .sec { margin-top: var(--gap-sec); }
  .sec.gap2,
  .sec.chorus, .sec.chorus + .sec,
  .sec.bridge, .sec.bridge + .sec { margin-top: var(--gap-big); }
  /* Un estribillo plegado es una sola l\xEDnea: hueco normal, no de bloque. */
  body.compact .sec.rep:not(.gap2), body.compact .sec.rep + .sec:not(.gap2),
  body.auto-compact .sec.rep:not(.gap2), body.auto-compact .sec.rep + .sec:not(.gap2) {
    margin-top: var(--gap-sec);
  }
  .sheet > .sec:first-child { margin-top: 0; }
  .sec > * + *, .rep-one > * + *, .rep-fold > * + * { margin-top: var(--gap-line); }
  .sec > .lbl + *, .rep-one > .lbl + * { margin-top: 0.2em; }
  .rep-one + .rep-one { margin-top: var(--gap-big); }
  .ln {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
  }
  /* En columnas y en p\xE1ginas, una secci\xF3n larga puede partirse entre dos
     columnas, pero nunca una l\xEDnea por dentro (se separaba el \xABla\xBB de \xABla
     comunidad alienta\xBB), ni una etiqueta o un arreglo de lo que anuncian. */
  .ln, .cm, .arrangement, .lbl, summary { break-inside: avoid; }
  .lbl, .arrangement { break-after: avoid; }
  .w {
    display: inline-flex;
    align-items: flex-end;
    flex-shrink: 0;
    max-width: 100%;
  }
  .s { display: inline-flex; flex-direction: column; min-width: 0; }
  .c {
    color: var(--sh-chord);
    font-weight: 700;
    font-size: 0.92em;
    line-height: 1.2;
    white-space: pre;
    /* Hueco tras el acorde: \xABSOL7\xBB sobre \xABa\xBB no se pega al siguiente. */
    padding-right: 0.4em;
  }
  .t { display: flex; line-height: 1.34; min-height: 1.34em; white-space: pre; }
  /* Con el script en marcha (\`ov\`), el acorde no ocupa ancho: vuela sobre
     la letra y el script separa los que chocar\xEDan. */
  body.ov .ln.ly .c { width: 0; padding-right: 0; overflow: visible; }
  /* Un acorde m\xE1s ancho que su s\xEDlaba a media palabra (\xABac\xE9rca[SOL]te[SOL7].\xBB)
     abre un hueco en la palabra: una raya tenue lo une, as\xED se lee \xABte\u2500\u2500.\xBB
     como una sola palabra. Sin hueco, la raya mide cero. */
  .s.m > .t::after {
    content: '';
    flex: 1 1 0;
    min-width: 0;
    align-self: stretch;
    /* Sin m\xE1rgenes: un margen ocupar\xEDa sitio aunque la raya mida cero. */
    background: linear-gradient(var(--sh-filler), var(--sh-filler))
      center 64% / calc(100% - 0.3em) 1.5px no-repeat;
  }
  .br { flex-basis: 100%; height: 0; }
  .w.cont { margin-left: var(--sh-cont-indent, 0.9em); }
  .vn {
    align-self: flex-end;
    color: var(--sh-label);
    font-weight: 700;
    font-size: 0.78em;
    line-height: 1.7;
    min-width: 1.1em;
    margin-right: 0.35em;
  }
  .w.bis .t { color: var(--sh-muted); font-style: italic; }
  .ln.co { gap: 0.15em 1em; }
  .ln.co .c { padding-right: 0; }
  .cn { color: var(--sh-muted); font-style: italic; line-height: 1.2; }
  .cm {
    color: var(--sh-muted);
    font-style: italic;
    font-size: 0.86em;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    margin: 0;
  }
  .sec > .arrangement, .rep-one > .arrangement { margin-top: 0; margin-bottom: 0; }
  .sec > * + .arrangement, .rep-one > * + .arrangement { margin-top: var(--gap-line); }
  .sec.rep > .rep-fold { margin-top: 0; }
  .lbl {
    color: var(--sh-label);
    font-size: 0.6em;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    line-height: 1.4;
    margin: 0;
  }
  /* Estribillo: raya a la izquierda (en el margen, as\xED la letra no se mueve
     de sitio) y un fondo que apenas se nota. */
  .sec.chorus {
    border-left: 3px solid var(--sh-chorus-bar);
    background: var(--sh-chorus-bg);
    padding: 0.35em 0.5em 0.3em 10px;
    margin-left: -13px;
    border-radius: 0 10px 10px 0;
  }
  .sec.bridge { border-left: 3px dashed var(--sh-chorus-bar); padding-left: 10px; margin-left: -13px; }
  /* Variantes del estribillo (\xABLetra y vista\xBB \u2192 Estribillo). La de serie
     es la raya; las dem\xE1s suman negrita, may\xFAsculas o vuelven al estilo de
     cantoral de papel (sin raya, o sangrado). */
  body.ch-negrita .sec.chorus .t,
  body.ch-mayus .sec.chorus .t,
  body.ch-clasico .sec.chorus .t,
  body.ch-sangrado .sec.chorus .t { font-weight: 700; }
  body.ch-mayus .sec.chorus .t,
  body.ch-clasico .sec.chorus .t { text-transform: uppercase; }
  body.ch-clasico .sec.chorus,
  body.ch-sangrado .sec.chorus {
    border-left: 0;
    background: none;
    padding: 0;
    margin-left: 0;
    border-radius: 0;
  }
  body.ch-sangrado .sec.chorus { padding-left: 1.3em; }
  body.ch-nolabel .sec.chorus > .lbl,
  body.ch-nolabel .sec.chorus .rep-one > .lbl { display: none; }
  /* Vista completa / compacta: la repetici\xF3n sale dos veces en el HTML y la
     clase del body decide cu\xE1l se ve (cambiar no recarga nada). En iPad, si
     la canci\xF3n cabe entera a columnas, se pliega sola (\`auto-compact\`):
     el estribillo ya est\xE1 a la vista. */
  body:not(.compact):not(.auto-compact) .rep-fold { display: none; }
  body.compact .rep-full, body.auto-compact .rep-full { display: none; }
  details.rep-fold { padding-top: 0.1em; padding-bottom: 0.1em; }
  details.rep-fold > summary {
    list-style: none;
    display: flex;
    align-items: baseline;
    gap: 0.6em;
    cursor: pointer;
    min-height: 1.6em;
    -webkit-tap-highlight-color: transparent;
  }
  details.rep-fold > summary::-webkit-details-marker { display: none; }
  details.rep-fold > summary .lbl { margin: 0; font-size: 0.68em; white-space: nowrap; }
  details.rep-fold .x { opacity: 0.75; font-weight: 600; letter-spacing: 0.02em; text-transform: none; }
  details.rep-fold .pv {
    flex: 1;
    min-width: 0;
    color: var(--sh-muted);
    font-size: 0.82em;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  details.rep-fold[open] > summary { margin-bottom: 0.35em; }
  details.rep-fold[open] .pv { display: none; }
  /* Sin acordes: fuera los acordes, las l\xEDneas de solo acordes y las
     intros instrumentales enteras. */
  body.chords-hidden .c,
  body.chords-hidden .ln.co,
  body.chords-hidden .sec.instrumental { display: none !important; }
  body.chords-hidden .s.m > .t::after { display: none; }
  body.nums-hidden .vn { display: none; }
  body.chords-hidden .xc { display: none; }
  /* Modo atril (pantalla completa en p\xE1ginas). */
  html:has(body.paged), body.paged { overflow: hidden; }
  body.paged .pager { overflow: hidden; }
  body.paged .sheet {
    column-fill: auto;
    column-rule: none;
    margin-top: 0;
    transition: transform 0.28s ease;
  }
  @media (prefers-reduced-motion: reduce) {
    body.paged .sheet { transition: none; }
  }
  body.paged .sheet .sec.chorus { margin-left: 0; }
  .pages-ind {
    position: fixed;
    left: 50%;
    bottom: calc(var(--song-pad-bottom) * 0.35);
    transform: translateX(-50%);
    padding: 0.2em 0.8em;
    border-radius: 999px;
    background: var(--sh-chorus-bg);
    color: var(--sh-label);
    font-weight: 700;
    font-size: 0.8em;
    font-variant-numeric: tabular-nums;
    pointer-events: none;
  }
  .rot-hint {
    margin: 0.2em 0 0.6em;
    color: var(--sh-label);
    font-size: 0.8em;
    font-weight: 600;
  }
  /* Columnas (iPad, solo si la canci\xF3n cabe entera sin scroll). */
  body.cols { padding-left: 28px; padding-right: 28px; }
  @media (min-width: 720px) {
    body.paged { padding-left: 28px; padding-right: 28px; }
  }
  body.cols .sheet .sec.chorus { margin-left: 0; }
`,wa=`
(function () {
  // ROW: lo que cuesta un rengl\xF3n m\xE1s. Un corte detr\xE1s de un art\xEDculo o
  // una preposici\xF3n (WEAK) cuesta m\xE1s que un rengl\xF3n: antes \xABHay muchas
  // formas / de orar,\xBB que \xABHay muchas formas de / orar,\xBB.
  var STRONG = 0, COMMA = 2, CONJ = 3, PREP = 5, PLAIN = 8, WEAK = 40, ROW = 24;
  var CONJ_RE = /^(y|e|o|u|ni|que|pero|porque|pues|como|cuando|donde|mientras|aunque|sino|si)$/;
  var PREP_RE = /^(a|al|ante|bajo|con|contra|de|del|desde|en|entre|hacia|hasta|para|por|seg\\u00fan|sin|sobre|tras)$/;
  // Detr\xE1s de estas no se corta: art\xEDculos, posesivos, cl\xEDticos,
  // preposiciones y nexos se quedan con la palabra que les sigue.
  var WEAK_RE = /^(el|la|los|las|lo|un|una|unos|unas|mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras|vuestro|vuestra|me|te|se|nos|os|le|les|y|e|o|u|ni|que|a|al|de|del|en|con|por|para|sin|sobre|tras|desde|hasta|muy|tan|m\\u00e1s|no|ya)$/;

  function bare(t) {
    return t.toLowerCase().replace(/[^a-z\\u00e1\\u00e9\\u00ed\\u00f3\\u00fa\\u00fc\\u00f1]/g, '');
  }

  /** Coste de partir ENTRE la palabra prev y la palabra next. */
  function penalty(prev, next, nextHasChord) {
    var p = prev.replace(/\\s+$/, '');
    var bonus = nextHasChord ? -1 : 0;
    if (/[.;:!?\\u2026]['"\\u00bb\\u201d)\\]]*$/.test(p)) return STRONG + bonus;
    if (/[,\\u2014\\u2013-]['"\\u00bb\\u201d)\\]]*$/.test(p)) return COMMA + bonus;
    if (WEAK_RE.test(bare(p))) return WEAK;
    var n = bare(next);
    if (CONJ_RE.test(n)) return CONJ + bonus;
    if (PREP_RE.test(n)) return PREP + bonus;
    return PLAIN + bonus;
  }

  /**
   * Cortes \xF3ptimos. w: anchos de las palabras; pen[i]: coste de cortar tras
   * la palabra i; first/rest: ancho disponible del primer rengl\xF3n y de los
   * siguientes (que llevan sangr\xEDa); ov[i] (opcional): lo que un acorde
   * sobresale por la derecha si el rengl\xF3n acaba en la palabra i. Devuelve
   * los \xEDndices de las palabras que empiezan rengl\xF3n nuevo.
   */
  function chooseBreaks(w, pen, first, rest, ov) {
    var n = w.length, INF = 1e15, cost = [0], from = [0], i, j;
    for (j = 1; j <= n; j++) { cost[j] = INF; from[j] = 0; }
    for (i = 0; i < n; i++) {
      if (cost[i] >= INF) continue;
      var lim = i === 0 ? first : rest, sum = 0;
      for (j = i + 1; j <= n; j++) {
        sum += w[j - 1];
        if (sum > lim && j > i + 1) break;
        var width = sum + (ov ? ov[j - 1] : 0);
        if (width > lim && j > i + 1) continue;
        var last = j === n;
        var slack = Math.max(0, lim - width) / lim;
        var c = cost[i] + ROW + slack * slack * (last ? 12 : 20) +
          (last ? 0 : pen[j - 1]) + (j - i === 1 && n > 2 ? 6 : 0);
        if (c < cost[j]) { cost[j] = c; from[j] = i; }
      }
    }
    var out = [], k = n;
    while (k > 0) { var s = from[k]; if (s > 0) out.unshift(s); k = s; }
    return out;
  }

  function atomsOf(line) {
    var out = [], ch = line.children;
    for (var i = 0; i < ch.length; i++) if (ch[i].classList.contains('w')) out.push(ch[i]);
    return out;
  }
  function textOf(atom) {
    var ts = atom.querySelectorAll('.t'), s = '';
    for (var i = 0; i < ts.length; i++) s += ts[i].textContent;
    return s;
  }
  function chordsShown() { return !document.body.classList.contains('chords-hidden'); }

  function chordWidth(c) {
    var r = document.createRange();
    r.selectNodeContents(c);
    return r.getBoundingClientRect().width;
  }

  /**
   * Acordes que \xABvuelan\xBB: un acorde ocupa su sitio encima de la letra, no al
   * lado, as\xED que \xABSOL\xBB sobre \xABa quien\xBB no abre un hueco en \xABa\xBB. Solo cuando
   * dos acordes chocar\xEDan se ensancha la letra que hay entre ellos (y si es a
   * media palabra, una raya tenue la une). Calcula, por l\xEDnea, cu\xE1nto
   * ensanchar cada trozo y cu\xE1nto sobresale el \xFAltimo acorde de cada palabra.
   * \xABbreaks\xBB (opcional): \xEDndices de palabra que empiezan rengl\xF3n; dos acordes
   * en renglones distintos no chocan.
   */
  function chordPlan(atoms, gap, breaks) {
    var segs = [], segAtom = [], i, j;
    for (i = 0; i < atoms.length; i++) {
      var ss = atoms[i].querySelectorAll('.s');
      for (j = 0; j < ss.length; j++) { segs.push(ss[j]); segAtom.push(i); }
    }
    var tw = [], cw = [];
    for (i = 0; i < segs.length; i++) {
      tw.push(segs[i].querySelector('.t').getBoundingClientRect().width);
      var c = segs[i].querySelector('.c');
      cw.push(c ? chordWidth(c) : -1);
    }
    var startsRow = {};
    if (breaks) for (i = 0; i < breaks.length; i++) startsRow[breaks[i]] = true;
    var pad = [], last = -1, dist = 0;
    for (i = 0; i < segs.length; i++) {
      pad.push(0);
      var newRow = i > 0 && segAtom[i] !== segAtom[i - 1] && startsRow[segAtom[i]];
      if (newRow) { last = -1; dist = 0; }
      if (cw[i] >= 0) {
        if (last >= 0) {
          var need = cw[last] + gap - dist;
          if (need > 0.5) { pad[i - 1] += need; }
        }
        last = i; dist = 0;
      }
      dist += tw[i] + pad[i];
    }
    // Cu\xE1nto sobresale el acorde m\xE1s a la derecha si el rengl\xF3n acaba en
    // cada palabra (posiciones relativas: el n\xFAmero de estrofa delante no
    // cambia la diferencia).
    var ov = [], pos = 0, reach = 0;
    for (i = 0; i < segs.length; i++) {
      if (i > 0 && segAtom[i] !== segAtom[i - 1] && startsRow[segAtom[i]]) { pos = 0; reach = 0; }
      if (cw[i] >= 0) reach = Math.max(reach, pos + cw[i]);
      pos += tw[i] + pad[i];
      var endOfAtom = i === segs.length - 1 || segAtom[i + 1] !== segAtom[i];
      if (endOfAtom) ov[segAtom[i]] = Math.max(0, reach - pos);
    }
    return { segs: segs, tw: tw, pad: pad, ov: ov };
  }

  function applyPads(plan) {
    for (var i = 0; i < plan.segs.length; i++) {
      plan.segs[i].style.minWidth = plan.pad[i] > 0 ? (plan.tw[i] + plan.pad[i]) + 'px' : '';
    }
  }

  function relayout(root) {
    root = root || document;
    var lines = root.querySelectorAll('.ln.ly'), i, j;
    var body = document.body;
    var showChords = chordsShown();
    // Acordes volando solo con este script en marcha: sin \xE9l, cada acorde
    // ocupa su ancho y nunca se pisan.
    body.classList.toggle('ov', showChords);
    // 1) Quitar lo de la pasada anterior (solo escrituras).
    for (i = 0; i < lines.length; i++) {
      var brs = lines[i].querySelectorAll('.br');
      for (j = 0; j < brs.length; j++) brs[j].parentNode.removeChild(brs[j]);
      var cs = lines[i].querySelectorAll('.w.cont');
      for (j = 0; j < cs.length; j++) cs[j].classList.remove('cont');
      var ps = lines[i].querySelectorAll('.s');
      for (j = 0; j < ps.length; j++) ps[j].style.minWidth = '';
    }
    var probe = document.querySelector('.sheet');
    if (!probe) return;
    var fs = parseFloat(getComputedStyle(probe).fontSize) || 16;
    var indent = fs * 0.9, gap = fs * 0.4;
    // 2) Huecos entre acordes que chocar\xEDan, con la l\xEDnea entera seguida.
    var items = [];
    for (i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line.clientWidth) continue;
      var atoms = atomsOf(line);
      items.push({ line: line, atoms: atoms, plan: showChords ? chordPlan(atoms, gap) : null });
    }
    for (i = 0; i < items.length; i++) if (items[i].plan) applyPads(items[i].plan);
    // 3) Medir palabras y elegir cortes.
    for (i = 0; i < items.length; i++) {
      var it = items[i], avail = it.line.clientWidth, widths = [], total = 0;
      for (j = 0; j < it.atoms.length; j++) {
        var wd = it.atoms[j].getBoundingClientRect().width;
        widths.push(wd); total += wd;
      }
      var ov = it.plan ? it.plan.ov : null;
      var tail = ov && ov.length ? ov[ov.length - 1] : 0;
      // El espacio final de cada palabra va dentro de su caja: tambi\xE9n
      // cuenta para el salto, as\xED que no hay tolerancia que valga.
      if (total + tail <= avail + 0.5 || it.atoms.length < 2) { it.breaks = null; continue; }
      var pens = [];
      for (j = 0; j < it.atoms.length - 1; j++) {
        var nextChord = showChords && !!it.atoms[j + 1].querySelector('.c');
        pens.push(penalty(textOf(it.atoms[j]), textOf(it.atoms[j + 1]), nextChord));
      }
      it.breaks = chooseBreaks(widths, pens, avail + 0.5, avail - indent + 0.5, ov);
    }
    // 4) Cortes, y huecos recalculados por rengl\xF3n: dos acordes que han
    //    quedado en renglones distintos ya no necesitan separarse.
    for (i = 0; i < items.length; i++) {
      var t = items[i];
      if (!t.breaks || !t.breaks.length) continue;
      for (j = 0; j < t.breaks.length; j++) {
        var a = t.atoms[t.breaks[j]], el = document.createElement('span');
        el.className = 'br';
        a.parentNode.insertBefore(el, a);
        a.classList.add('cont');
      }
      if (t.plan) {
        var ps2 = t.plan.segs;
        for (j = 0; j < ps2.length; j++) ps2[j].style.minWidth = '';
        t.plan2 = chordPlan(t.atoms, gap, t.breaks);
      }
    }
    for (i = 0; i < items.length; i++) if (items[i].plan2) applyPads(items[i].plan2);
  }

  function fitsWithin(limitH) {
    // En iOS el detalle desplaza la letra con un contentInset nativo (bajo
    // el header transparente) que el documento no ve: SongDisplay lo deja
    // en __SONG_VIEW_INSET__ para restarlo aqu\xED.
    var inset = window.__SONG_VIEW_INSET__ || 0;
    return contentHeight() + inset <= limitH + 1;
  }

  /**
   * Alto de lo que hay que ver (cabecera + hoja + margen de abajo). No vale
   * el scrollHeight del documento: nunca baja del alto de la pantalla, y al
   * simular la otra orientaci\xF3n hay que medir contra un alto menor.
   */
  function contentHeight() {
    var wrap = pager() || document.querySelector('.sheet');
    if (!wrap) return document.documentElement.scrollHeight;
    var pad = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    return wrap.getBoundingClientRect().bottom + (window.scrollY || 0) + pad;
  }

  /**
   * Columnas en pantallas anchas (iPad), solo si as\xED la canci\xF3n cabe ENTERA
   * en la pantalla. Para conseguirlo puede achicar la letra hasta un 20 %;
   * si ni as\xED cabe, una sola columna y al tama\xF1o elegido. Con columnas, los
   * estribillos repetidos se pliegan solos (\`auto-compact\`): el estribillo
   * ya est\xE1 a la vista en otra columna. En un m\xF3vil nunca caben dos
   * columnas, as\xED que all\xED esto no hace nada.
   */
  var SCALES = [1, 0.92, 0.86, 0.8];
  function resetColumns(sheet) {
    document.body.classList.remove('cols');
    document.body.classList.remove('auto-compact');
    sheet.style.columnCount = '';
    sheet.style.fontSize = '';
  }
  function tryColumns(sheet, limitH, viewW) {
    var body = document.body;
    var base = parseFloat(getComputedStyle(sheet).fontSize) || 16;
    // Fuera antes de tocar nada si no caben dos columnas ni con la letra m\xE1s
    // peque\xF1a: cada intento es otra maquetaci\xF3n entera.
    var small = base * SCALES[SCALES.length - 1];
    if (viewW - 56 < 2 * small * 19 + small * 2.2) return false;
    // Con columnas el texto usa todo el ancho de la pantalla (sin el margen
    // que lo centra a 760 px): se mide ya con ese ancho.
    body.classList.add('cols');
    body.classList.add('auto-compact');
    var width = sheet.clientWidth;
    for (var si = 0; si < SCALES.length; si++) {
      var fs = base * SCALES[si], gap = fs * 2.2;
      var maxCols = Math.min(3, Math.floor((width + gap) / (fs * 19 + gap)));
      if (maxCols < 2) continue;
      sheet.style.fontSize = SCALES[si] === 1 ? '' : fs + 'px';
      for (var k = 2; k <= maxCols; k++) {
        sheet.style.columnCount = String(k);
        relayout();
        if (fitsWithin(limitH)) return true;
      }
    }
    resetColumns(sheet);
    return false;
  }

  /**
   * \xBFCabr\xEDa entera girando la pantalla? Se maqueta con el ancho y el alto
   * cambiados, se mira y se deshace. Solo en tablet: un m\xF3vil en horizontal
   * tiene sitio para muy pocas l\xEDneas.
   */
  function fitsRotated(sheet) {
    var w = window.innerWidth, h = window.innerHeight;
    if (Math.min(w, h) < 600) return false;
    var root = document.documentElement;
    root.style.width = h + 'px';
    relayout();
    var ok = fitsWithin(w) || tryColumns(sheet, w, h);
    root.style.width = '';
    resetColumns(sheet);
    return ok;
  }

  function setRotateHint(show) {
    var hint = document.querySelector('.rot-hint');
    if (!hint) return;
    hint.hidden = !show;
    if (show) {
      hint.textContent = '\u21BB Gira la pantalla: en ' +
        (window.innerWidth < window.innerHeight ? 'horizontal' : 'vertical') +
        ' se ve entera';
    }
  }

  // \u2500\u2500 Modo atril: p\xE1ginas en vez de scroll \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // La hoja se reparte en columnas de la altura de la pantalla que se
  // desbordan hacia la derecha; una p\xE1gina son las columnas que caben a lo
  // ancho, y pasar de p\xE1gina es desplazar la hoja una pantalla. Las
  // secciones no se parten entre columnas (break-inside: avoid), as\xED que una
  // p\xE1gina nunca corta una estrofa por la mitad salvo que no quepa entera.
  var page = 0, pageCount = 1, stride = 0;

  function pager() { return document.querySelector('.pager'); }

  function indicator() {
    var el = document.querySelector('.pages-ind');
    if (!el) {
      el = document.createElement('div');
      el.className = 'pages-ind';
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    return el;
  }

  function showPage() {
    var sheet = document.querySelector('.sheet');
    if (!sheet) return;
    page = Math.max(0, Math.min(page, pageCount - 1));
    sheet.style.transform = 'translateX(' + (-page * stride) + 'px)';
    var ind = indicator();
    ind.hidden = pageCount < 2;
    ind.textContent = (page + 1) + ' / ' + pageCount;
  }

  function goPage(delta) {
    if (!document.body.classList.contains('paged')) return false;
    var next = Math.max(0, Math.min(page + delta, pageCount - 1));
    if (next === page) return false;
    page = next;
    showPage();
    return true;
  }

  function columnsUsed(sheet, colW, gap) {
    return Math.max(1, Math.round((sheet.scrollWidth + gap) / (colW + gap)));
  }

  function paginate(sheet) {
    var body = document.body, wrap = pager();
    if (!wrap) return;
    resetColumns(sheet);
    sheet.style.transform = '';
    var cs = getComputedStyle(body);
    var padBottom = parseFloat(cs.paddingBottom) || 0;
    var top = wrap.getBoundingClientRect().top;
    var pageH = Math.max(120, window.innerHeight - top - padBottom);
    var base = parseFloat(getComputedStyle(sheet).fontSize) || 16;
    var width = wrap.clientWidth;
    // Como en las columnas del iPad: si con la letra hasta un 20 % m\xE1s
    // peque\xF1a cabe toda en UNA p\xE1gina, as\xED; si no, p\xE1ginas a su tama\xF1o.
    function layoutAt(si) {
      var fs = base * SCALES[si], gap = fs * 2.2;
      var k = Math.max(1, Math.min(3, Math.floor((width + gap) / (fs * 19 + gap))));
      var colW = (width - (k - 1) * gap) / k;
      sheet.style.fontSize = SCALES[si] === 1 ? '' : fs + 'px';
      sheet.style.height = pageH + 'px';
      sheet.style.columnWidth = colW + 'px';
      sheet.style.columnGap = gap + 'px';
      // Varias columnas a la vista: el estribillo repetido se pliega.
      body.classList.toggle('auto-compact', k > 1);
      relayout();
      return { k: k, colW: colW, gap: gap, cols: columnsUsed(sheet, colW, gap) };
    }
    var chosen = null;
    for (var si = 0; si < SCALES.length && !chosen; si++) {
      var plan = layoutAt(si);
      if (plan.cols <= plan.k) chosen = plan;
    }
    if (!chosen) chosen = layoutAt(0);
    stride = chosen.k * (chosen.colW + chosen.gap);
    pageCount = Math.max(1, Math.ceil(chosen.cols / chosen.k));
    showPage();
  }

  function unpaginate(sheet) {
    sheet.style.height = '';
    sheet.style.columnWidth = '';
    sheet.style.columnGap = '';
    sheet.style.transform = '';
    page = 0; pageCount = 1;
    var ind = document.querySelector('.pages-ind');
    if (ind) ind.hidden = true;
  }

  function refit() {
    var sheet = document.querySelector('.sheet');
    if (!sheet) return;
    if (document.body.classList.contains('paged')) {
      setRotateHint(false);
      paginate(sheet);
      return;
    }
    unpaginate(sheet);
    resetColumns(sheet);
    relayout();
    if (fitsWithin(window.innerHeight)) { setRotateHint(false); return; }
    if (tryColumns(sheet, window.innerHeight, window.innerWidth)) {
      setRotateHint(false);
      return;
    }
    var rotate = fitsRotated(sheet);
    relayout();
    setRotateHint(rotate);
  }

  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    (window.requestAnimationFrame || setTimeout)(function () {
      pending = false;
      try { refit(); } catch (e) {}
    });
  }

  window.__SONG_LAYOUT__ = {
    refit: schedule,
    page: goPage,
    relayout: relayout,
    chooseBreaks: chooseBreaks,
    penalty: penalty
  };

  if (typeof document === 'undefined' || !document.addEventListener) return;
  window.addEventListener('resize', schedule);
  // Atril: un toque en el tercio izquierdo vuelve atr\xE1s, en el resto
  // avanza; las flechas, AvP\xE1g/ReP\xE1g, espacio e Intro hacen lo mismo (es lo
  // que mandan los pedales Bluetooth); y tambi\xE9n se puede deslizar.
  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('paged')) return;
    if (e.target && e.target.closest && e.target.closest('summary, a, button')) return;
    goPage(e.clientX < window.innerWidth / 3 ? -1 : 1);
  });
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    var d = k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter' ? 1
      : k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' ? -1 : 0;
    if (d && goPage(d)) e.preventDefault();
  });
  var touchX = null, touchY = null;
  document.addEventListener('touchstart', function (e) {
    if (!e.touches || e.touches.length !== 1) return;
    touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (touchX === null || !e.changedTouches || !e.changedTouches.length) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dy = e.changedTouches[0].clientY - touchY;
    touchX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (goPage(dx < 0 ? 1 : -1)) e.preventDefault();
    }
  });
  // Al desplegar un estribillo plegado, sus l\xEDneas se miden por primera vez.
  document.addEventListener('toggle', function (e) {
    if (e.target && e.target.tagName === 'DETAILS') {
      try { relayout(e.target); } catch (err) {}
    }
  }, true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
})();
`;var Cl={hasRepeats:!1,hasVerseNumbers:!1,hasChorus:!1},mt=new Map,Al=64;function Sl(r){var f,l,h;let s=mt.get(r);if(s!==void 0)return s;let e=xa(r).replace(/\{sov\}/gi,"{start_of_verse}").replace(/\{eov\}/gi,"{end_of_verse}").replace(/\{soc\}/gi,"{start_of_chorus}").replace(/\{eoc\}/gi,"{end_of_chorus}").replace(/\{sob\}/gi,"{start_of_bridge}").replace(/\{eob\}/gi,"{end_of_bridge}").replace(/\{\s*chorus\s*(?::\s*([^}]*))?\}/gi,(S,D)=>`{comment: ${ar}${(D!=null?D:"").trim()}}`).replace(/\{transpose:.*\}/gi,""),a;try{a={song:new tr().parse(We(e)),error:null}}catch(S){rr.error("Error parseando ChordPro en useSongProcessor:",S);let D=(f=S==null?void 0:S.location)==null?void 0:f.start,A=typeof(D==null?void 0:D.line)=="number"&&D.line>0?D.line:null,x=typeof(D==null?void 0:D.column)=="number"&&D.column>0?D.column:null,w=null,P=[];if(A!==null){let j=e.split(/\r?\n/);w=(l=j[A-1])!=null?l:null;let X=Math.max(1,A-1),ie=Math.min(j.length,A+1);for(let U=X;U<=ie;U++)P.push({n:U,text:(h=j[U-1])!=null?h:"",isError:U===A})}a={song:null,error:{message:typeof(S==null?void 0:S.message)=="string"?S.message:String(S),line:A,column:x,lineText:w,context:P}}}if(mt.size>=Al){let S=mt.keys().next().value;S!==void 0&&mt.delete(S)}return mt.set(r,a),a}var We=r=>r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function El(r,s,e){var Y;let a=s?"#1F1F21":"#FBF7F6",f=s?"#2C2C2E":"#FFFFFF",l=s?"rgba(255,255,255,0.06)":"rgba(225,92,98,0.10)",h=s?"0 18px 50px rgba(0,0,0,0.45)":"0 18px 50px rgba(225,92,98,0.12)",S=s?"#F2F2F4":"#1F2430",D=s?"#9A9AA0":"#9A8F8F",A=s?"#FF8A80":"#E15C62",x=s?"#FFB3AC":"#EE7E83",w=s?"rgba(255,138,128,0.22)":"rgba(225,92,98,0.16)",P=s?"rgba(255,138,128,0.08)":"rgba(225,92,98,0.05)",j=s?"rgba(255,138,128,0.24)":"rgba(225,92,98,0.18)",X=s?"#E8E8EC":"#43484F",ie=(r==null?void 0:r.line)!=null?`<div class="err-line-label">\u{1F4CD} L\xEDnea ${r.line}${r.column!=null?` \xB7 col. ${r.column}`:""}</div>`:"",U=(Y=r==null?void 0:r.context)!=null?Y:[],V=U.length>0?U.map(Z=>`<div class="err-row${Z.isError?" is-error":""}"><span class="err-gutter">${Z.n}</span><span class="err-line">${We(Z.text)||" "}</span></div>`).join(""):(r==null?void 0:r.lineText)!=null&&r.lineText.trim()!==""?`<div class="err-row is-error"><span class="err-line">${We(r.lineText)}</span></div>`:"",W=V?`<div class="err-codecard">
        <div class="err-codecard-bar"><span></span><span></span><span></span></div>
        <div class="err-code">${V}</div>
      </div>`:"",K=r!=null&&r.message&&r.message.trim()!==""?`<div class="err-hint"><span class="err-hint-tag">Pista</span>${We(r.message.trim())}</div>`:"";return`<!DOCTYPE html><html><head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      * { box-sizing: border-box; }
      html, body { height: 100%; margin: 0; }
      body {
        font-family: ${e};
        background:
          radial-gradient(120% 60% at 50% -10%, ${w} 0%, transparent 55%),
          ${a};
        color: ${S};
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 28px 22px;
        -webkit-font-smoothing: antialiased;
      }
      .err-card {
        max-width: 380px;
        width: 100%;
        text-align: center;
        background: ${f};
        border: 1px solid ${l};
        border-radius: 26px;
        box-shadow: ${h};
        padding: 34px 26px 28px;
        animation: err-pop 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      @keyframes err-pop {
        from { opacity: 0; transform: translateY(14px) scale(0.96); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }
      .err-badge {
        position: relative;
        width: 92px;
        height: 92px;
        margin: 0 auto 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(circle at 50% 38%, ${w} 0%, transparent 70%);
      }
      .err-badge::before {
        content: '';
        position: absolute;
        inset: 14px;
        border-radius: 50%;
        background: ${P};
        border: 1.5px solid ${j};
      }
      .err-emoji {
        position: relative;
        font-size: 44px;
        line-height: 1;
        animation: err-float 3.2s ease-in-out infinite;
      }
      @keyframes err-float {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50%      { transform: translateY(-4px) rotate(2deg); }
      }
      .err-title {
        font-size: 1.55em;
        font-weight: 800;
        margin: 0 0 6px;
        color: ${A};
        letter-spacing: -0.015em;
      }
      .err-sub {
        font-size: 1.02em;
        font-weight: 600;
        line-height: 1.4;
        margin: 0 auto 18px;
        max-width: 17em;
        color: ${S};
      }
      .err-line-label {
        display: inline-block;
        font-size: 0.74em;
        font-weight: 700;
        letter-spacing: 0.01em;
        color: ${x};
        background: ${P};
        border: 1px solid ${j};
        padding: 5px 13px;
        border-radius: 999px;
        margin-bottom: 12px;
      }
      .err-codecard {
        text-align: left;
        background: ${P};
        border: 1px solid ${j};
        border-radius: 14px;
        overflow: hidden;
        margin: 0 0 16px;
      }
      .err-codecard-bar {
        display: flex;
        gap: 6px;
        padding: 9px 12px;
        border-bottom: 1px solid ${j};
      }
      .err-codecard-bar span {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: ${x};
        opacity: 0.55;
      }
      .err-code {
        font-family: 'Roboto Mono', 'Courier New', monospace;
        font-size: 0.84em;
        line-height: 1.55;
        margin: 0;
        padding: 8px 0;
        color: ${X};
      }
      .err-row {
        display: flex;
        align-items: baseline;
        padding: 1px 14px 1px 0;
      }
      .err-row.is-error {
        background: ${w};
        box-shadow: inset 3px 0 0 ${A};
      }
      .err-gutter {
        flex: 0 0 auto;
        width: 2.6em;
        padding-right: 12px;
        text-align: right;
        color: ${D};
        opacity: 0.7;
        user-select: none;
      }
      .err-row.is-error .err-gutter {
        color: ${A};
        opacity: 1;
        font-weight: 700;
      }
      .err-line {
        flex: 1 1 auto;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .err-hint {
        text-align: left;
        font-size: 0.76em;
        line-height: 1.5;
        color: ${D};
        background: ${P};
        border: 1px dashed ${j};
        border-radius: 12px;
        padding: 10px 13px;
        margin: 0 0 22px;
        word-break: break-word;
      }
      .err-hint-tag {
        display: inline-block;
        font-size: 0.82em;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: ${A};
        margin-right: 8px;
      }
      .err-foot {
        font-size: 0.72em;
        line-height: 1.5;
        color: ${D};
        margin: 0;
        opacity: 0.92;
      }
      .err-foot::before {
        content: '';
        display: block;
        width: 34px;
        height: 2px;
        border-radius: 2px;
        margin: 0 auto 12px;
        background: linear-gradient(90deg, transparent, ${j}, transparent);
      }
    </style>
  </head><body>
    <div class="err-card">
      <div class="err-badge"><span class="err-emoji">\u{1F605}</span></div>
      <h1 class="err-title">Ay, mecachis</h1>
      <p class="err-sub">Hay un error procesando esta canci\xF3n</p>
      ${ie}
      ${W}
      ${K}
      <p class="err-foot">Hemos avisado a la gente maja que mantiene el cantoral para arreglarlo</p>
    </div>
  </body></html>`}var Fl=r=>({bodyBg:r?"#2C2C2E":"#ffffff",bodyText:r?"#E5E5EA":"#212529",titleText:r?"#F5F5F7":"#1C1C1E",authorText:r?"#98989D":"#8E8E93",chordColor:r?"#64B5F6":ms.chordBlue,commentText:r?"#98989D":ms.chordSecondaryText,badgeBg:r?"rgba(244, 193, 30, 0.12)":"rgba(37, 56, 131, 0.06)",badgeText:r?"#F4C11E":"#253883",badgeAccentBg:r?"rgba(225, 92, 98, 0.15)":"rgba(225, 92, 98, 0.08)",badgeAccentText:r?"#FF8A80":"#C62828",fsBgTop:r?"rgba(44,44,46,0.97)":"rgba(255,255,255,0.97)",fsBgMid:r?"rgba(44,44,46,0.88)":"rgba(255,255,255,0.88)"}),Ll=r=>[r.isDark&&"theme-dark",!r.chordsVisible&&"chords-hidden",!r.arrangementsVisible&&"arr-hidden",r.compact&&"compact",!r.verseNumbers&&"nums-hidden",`ch-${r.chorusStyle}`,!r.chorusLabel&&"ch-nolabel",r.airy&&"airy",r.paged&&"paged"].filter(Boolean).join(" ");function wl(r,s){let{currentTranspose:e,notation:a,title:f,author:l,key:h,capo:S,isFullscreen:D=!1,adminMode:A=!1}=s,x=s.style,w=Fl(x.isDark),P=e!==0?r.transpose(e):r,j=Sa(P,{notation:a}),X={hasRepeats:j.sections.some(J=>J.repeatOf!==null),hasVerseNumbers:j.sections.some(J=>J.number!==null),hasChorus:j.sections.some(J=>J.kind==="chorus")},ie=Ea(j,{lineNumbers:A}),U=P.title||We(f!=null?f:""),V="";l&&!D&&(V+=`<div class="song-meta-author">${We(l)}</div>`);let W=h?e!==0?$a(h,e):h.toUpperCase():"",K=We(ir(W,a)),Y="";if(W&&(Y+=`<span class="meta-badge">${K}</span>`),S!==void 0&&S>0&&(Y+=`<span class="meta-badge">Cejilla ${S}</span>`),j.reviewNotes.length>0&&(Y+='<span class="meta-badge meta-badge-muted">Acordes sin revisar</span>'),e!==0){let J=e>0?`+${e}`:`${e}`;Y+=`<span class="meta-badge meta-badge-accent">${J} semitonos</span>`}Y&&!D&&(V+=`<div class="song-meta-keycapo">${Y}</div>`);let Z="";if(D){let J="";if(l&&(J+=`<span class="fs-author">${We(l)}</span>`),W&&(J&&(J+='<span class="fs-sep">\xB7</span>'),J+=`<span class="fs-badge-sm">${K}</span>`),S!==void 0&&S>0&&(J+=`<span class="fs-badge-sm">Cejilla ${S}</span>`),e!==0){let fe=e>0?`+${e}`:`${e}`;J+=`<span class="fs-badge-sm fs-badge-accent">${fe} semitonos</span>`}Z=`<div class="fs-header">${f?`<div class="fs-title">${We(f)}</div>`:""}${J?`<div class="fs-meta">${J}</div>`:""}</div>`}let be=(U?`<h1>${U}</h1>`:"")+V+`<div class="rot-hint" hidden></div><div class="pager">${ie}</div>`,Ce=`
    (function(){
      var docEl = document.documentElement;
      function apply(s) {
        if (!s || typeof s !== 'object') return;
        var r = docEl.style;
        if (typeof s.fontSize === 'number') r.setProperty('--song-font-size', s.fontSize + 'em');
        if (typeof s.fontFamily === 'string') r.setProperty('--song-font-family', s.fontFamily);
        if (typeof s.topPadding === 'number') r.setProperty('--song-pad-top', s.topPadding + 'px');
        if (typeof s.bottomPadding === 'number') r.setProperty('--song-pad-bottom', s.bottomPadding + 'px');
        if (typeof s.isDark === 'boolean') {
          document.body.classList.toggle('theme-dark', s.isDark);
        }
        if (typeof s.chordsVisible === 'boolean') {
          document.body.classList.toggle('chords-hidden', !s.chordsVisible);
        }
        if (typeof s.arrangementsVisible === 'boolean') {
          document.body.classList.toggle('arr-hidden', !s.arrangementsVisible);
        }
        if (typeof s.compact === 'boolean') {
          document.body.classList.toggle('compact', s.compact);
        }
        if (typeof s.verseNumbers === 'boolean') {
          document.body.classList.toggle('nums-hidden', !s.verseNumbers);
        }
        if (typeof s.chorusStyle === 'string') {
          ${JSON.stringify(Fa)}.forEach(function (c) {
            document.body.classList.toggle(c, c === 'ch-' + s.chorusStyle);
          });
        }
        if (typeof s.chorusLabel === 'boolean') {
          document.body.classList.toggle('ch-nolabel', !s.chorusLabel);
        }
        if (typeof s.airy === 'boolean') {
          document.body.classList.toggle('airy', s.airy);
        }
        if (typeof s.paged === 'boolean') {
          document.body.classList.toggle('paged', s.paged);
        }
        // Tama\xF1o, letra, acordes o vista cambian el ancho de las palabras:
        // hay que volver a elegir d\xF3nde se parte cada l\xEDnea.
        if (window.__SONG_LAYOUT__) window.__SONG_LAYOUT__.refit();
      }
      window.__SONG_BRIDGE__ = { apply: apply };
      function onMessage(ev) {
        try {
          var data = typeof ev.data === 'string' ? ev.data : '';
          if (!data) return;
          apply(JSON.parse(data));
        } catch (_) {}
      }
      // RN WebView (Android) dispatches on document, iOS/web on window.
      document.addEventListener('message', onMessage);
      window.addEventListener('message', onMessage);

      ${A?`
      // \u2500\u2500 Modo admin: long-press sobre una fila \u2192 avisar a RN con el \xEDndice
      // de la l\xEDnea original (data-line) para insertar un {arr:} encima. \u2500\u2500
      (function(){
        function post(payload) {
          var msg = JSON.stringify(payload);
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(msg);
          } else if (window.parent && window.parent !== window) {
            window.parent.postMessage(msg, '*'); // web (iframe)
          }
        }
        var timer = null, startX = 0, startY = 0, target = null, fired = false;
        var MOVE_CANCEL = 12, DELAY = 450;
        function rowFor(el) {
          while (el && el !== document.body) {
            if (el.hasAttribute && el.hasAttribute('data-line')) return el;
            el = el.parentElement;
          }
          return null;
        }
        function flash(el) {
          var prev = el.style.backgroundColor;
          el.style.transition = 'background-color 0.15s ease';
          el.style.backgroundColor = 'rgba(225,92,98,0.18)';
          setTimeout(function(){ el.style.backgroundColor = prev; }, 220);
        }
        function clear() { if (timer) { clearTimeout(timer); timer = null; } target = null; }
        function start(x, y, el) {
          var row = rowFor(el);
          if (!row) return;
          target = row; startX = x; startY = y; fired = false;
          timer = setTimeout(function(){
            fired = true;
            var line = parseInt(target.getAttribute('data-line'), 10);
            if (!isNaN(line)) { flash(target); post({ type: 'arr-longpress', line: line }); }
            clear();
          }, DELAY);
        }
        document.addEventListener('touchstart', function(e){
          if (!e.touches || !e.touches.length) return;
          start(e.touches[0].clientX, e.touches[0].clientY, e.target);
        }, { passive: true });
        document.addEventListener('touchmove', function(e){
          if (!timer || !e.touches || !e.touches.length) return;
          var dx = Math.abs(e.touches[0].clientX - startX);
          var dy = Math.abs(e.touches[0].clientY - startY);
          if (dx > MOVE_CANCEL || dy > MOVE_CANCEL) clear();
        }, { passive: true });
        document.addEventListener('touchend', function(){ clear(); }, { passive: true });
        document.addEventListener('touchcancel', function(){ clear(); }, { passive: true });
        // Soporte rat\xF3n (web): mousedown/up con el mismo retardo.
        document.addEventListener('mousedown', function(e){ start(e.clientX, e.clientY, e.target); });
        document.addEventListener('mousemove', function(e){
          if (!timer) return;
          if (Math.abs(e.clientX - startX) > MOVE_CANCEL || Math.abs(e.clientY - startY) > MOVE_CANCEL) clear();
        });
        document.addEventListener('mouseup', function(){ clear(); });
        // Evitar el men\xFA contextual del navegador en long-press (web).
        document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
      })();
      `:""}
    })();
  `;return{html:`
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <style>
        ${`
    :root {
      --song-font-size: ${x.fontSize}em;
      --song-font-family: ${x.fontFamily};
      --song-pad-top: ${x.topPadding}px;
      --song-pad-bottom: ${x.bottomPadding}px;
    }
  `}
        * { box-sizing: border-box; }
        body {
          font-family: var(--song-font-family);
          margin: 0;
          padding: var(--song-pad-top) 16px var(--song-pad-bottom) 16px;
          background-color: ${w.bodyBg};
          color: ${w.bodyText};
          font-size: 100%;
          max-width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          scrollbar-width: none;
          -ms-overflow-style: none;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        /* Dark theme \u2014 toggled live via .theme-dark on <body>. The default
           above is whichever the page was rendered with; flipping the
           class swaps the palette without reload. */
        body.theme-dark {
          background-color: #2C2C2E;
          color: #E5E5EA;
        }
        body.theme-dark h1 { color: #F5F5F7; }
        body.theme-dark .song-meta-author { color: #98989D; }
        body.theme-dark .arrangement { color: #FF8A80; }
        body.theme-dark .meta-badge {
          background: rgba(244, 193, 30, 0.12);
          color: #F4C11E;
        }
        body.theme-dark .meta-badge-accent {
          background: rgba(225, 92, 98, 0.15);
          color: #FF8A80;
        }
        body:not(.theme-dark) {
          background-color: #ffffff;
          color: #212529;
        }
        body:not(.theme-dark) h1 { color: #1C1C1E; }
        body:not(.theme-dark) .song-meta-author { color: #8E8E93; }
        body:not(.theme-dark) .arrangement { color: #E15C62; }
        body:not(.theme-dark) .meta-badge {
          background: rgba(37, 56, 131, 0.06);
          color: #253883;
        }
        body:not(.theme-dark) .meta-badge-accent {
          background: rgba(225, 92, 98, 0.08);
          color: #C62828;
        }
        /* Anotaciones de arreglo {arr:} \u2014 sutiles y alineadas a la derecha
           como rasgo distintivo. Toggle en vivo con .arr-hidden. */
        .arrangement {
          display: block;
          text-align: right;
          font-style: italic;
          font-weight: 500;
          font-size: calc(var(--song-font-size) * 0.78);
          line-height: 1.3;
          margin: 0.35em 0 0.55em;
          opacity: 0.95;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }
        body.arr-hidden .arrangement { display: none !important; }
        @media (min-width: 720px) {
          body { padding-left: max(16px, calc((100% - ${D?920:760}px) / 2)); padding-right: max(16px, calc((100% - ${D?920:760}px) / 2)); }
        }
        body::-webkit-scrollbar { width: 0; height: 0; }
        h1 {
          margin: 4px 0 8px;
          font-size: 1.35em;
          font-weight: 700;
          text-align: left;
          line-height: 1.25;
          letter-spacing: -0.01em;
          padding-bottom: 12px;
          position: relative;
          ${D?"display: none;":""}
        }
        h1::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #f4c11e, #E15C62);
          border-radius: 2px;
        }
        .song-meta-author {
          font-size: 0.88em;
          margin: 0 0 10px;
          font-style: italic;
          font-weight: 400;
          text-align: left;
        }
        .song-meta-keycapo {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }
        .meta-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.78em;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .meta-badge-muted {
          background: transparent !important;
          color: var(--sh-muted) !important;
          box-shadow: inset 0 0 0 1px var(--sh-filler);
        }
        ${La}
        ${D?`
        .fs-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: ${Math.max(x.topPadding-48,8)}px 60px 16px 16px;
          background: linear-gradient(to bottom,
            ${w.fsBgTop} 0%,
            ${w.fsBgMid} 72%,
            transparent 100%
          );
          z-index: 10;
          pointer-events: none;
        }
        .fs-title {
          font-size: 0.9em;
          font-weight: 700;
          color: ${w.titleText};
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 3px;
          opacity: 0.88;
        }
        .fs-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
        }
        .fs-author {
          font-size: 0.7em;
          color: ${w.authorText};
          font-style: italic;
        }
        .fs-sep {
          font-size: 0.65em;
          color: ${w.authorText};
          opacity: 0.45;
          margin: 0 1px;
        }
        .fs-badge-sm {
          font-size: 0.65em;
          font-weight: 600;
          color: ${w.badgeText};
          background: ${w.badgeBg};
          padding: 1px 6px;
          border-radius: 8px;
          letter-spacing: 0.01em;
        }
        .fs-badge-accent {
          color: ${w.badgeAccentText};
          background: ${w.badgeAccentBg};
        }`:""}
      </style>
    </head>
    <body class="${Ll(x)}">
      ${Z}
      ${be}
      <script>${wa}<\/script>
      <script>${Ce}<\/script>
    </body>
    </html>
  `,sheetInfo:X}}function va(r,s){let{song:e,error:a}=Sl(r);return e?{...wl(e,s),error:null}:{html:El(a,s.style.isDark,s.style.fontFamily),sheetInfo:Cl,error:a}}var cr=[{name:"Sistema",cssValue:"-apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"},{name:"Monoespaciada",cssValue:"'Roboto Mono', 'Courier New', monospace"},{name:"Serif",cssValue:"'Palatino Linotype', 'Book Antiqua', Palatino, serif"}],f1=cr[0].cssValue;var Da={notation:"ES",chordsVisible:!0,compact:!1,verseNumbers:!0,chorusStyle:"negrita",chorusLabel:!0,airy:!1,fontSize:1.25,fontFamily:cr[0].cssValue};function Dl(r,s={}){var f,l,h,S,D,A,x,w,P,j;let e=Da,a={fontSize:(f=s.fontSize)!=null?f:e.fontSize,fontFamily:(l=s.fontFamily)!=null?l:e.fontFamily,isDark:!!s.dark,chordsVisible:(h=s.chordsVisible)!=null?h:e.chordsVisible,arrangementsVisible:!0,compact:(S=s.compact)!=null?S:e.compact,verseNumbers:(D=s.verseNumbers)!=null?D:e.verseNumbers,chorusStyle:(A=s.chorusStyle)!=null?A:e.chorusStyle,chorusLabel:(x=s.chorusLabel)!=null?x:e.chorusLabel,airy:(w=s.airy)!=null?w:e.airy,paged:!1,topPadding:16,bottomPadding:40};return va(r,{style:a,currentTranspose:(P=s.transpose)!=null?P:0,notation:(j=s.notation)!=null?j:e.notation,title:s.title,author:s.author,key:s.key,capo:s.capo,adminMode:!!s.lineNumbers})}var Tl={render:Dl,defaults:Da,fonts:cr,chorusStyles:vi};globalThis.MCMSheet=Tl;})();
