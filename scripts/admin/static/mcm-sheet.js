/* mcm-sheet.js — GENERADO, no editar. Hoja de canción de la app MCM (mcmapp/mcm-app/utils/songDocument*.ts, commit d4c3fbb). Regenerar con «npm run build:sheet-bundle» en mcm-app. */
"use strict";(()=>{function hc(r){return r&&r.__esModule?r.default:r}var Tr=class extends Error{},dc={Ab:{B:"Cb"},Bb:{B:"Cb"},Cb:{B:"Cb","A#":"Bb",E:"Fb"},C:{"C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb"},"C#":{Eb:"D#",Bb:"A#"},Db:{Cb:"B","F#":"Gb","G#":"Ab","A#":"Bb"},D:{"D#":"Eb","A#":"Bb",Gb:"F#"},Eb:{"D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb"},E:{Ab:"G#","A#":"Bb","D#":"Eb",Db:"C#",Eb:"D#"},F:{"A#":"Bb","F#":"Gb","D#":"Eb","G#":"Ab"},"F#":{Bb:"A#",Eb:"D#"},Gb:{"A#":"Bb","D#":"Eb","G#":"Ab",B:"Cb",E:"Fb"},G:{"A#":"Bb","D#":"Eb","G#":"Ab","C#":"Db"},"G#":{"A#":"Bb","D#":"Eb",Cb:"B#"},Am:{"G#":"Ab","F#":"Gb","C#":"Db","D#":"Eb","A#":"Bb"},Bbm:{Cb:"B",Gb:"F#"},Bm:{"A#":"Bb","D#":"Eb"},"C#m":{"A#":"Bb","D#":"Eb",Gb:"F#"},Cm:{"G#":"Ab","A#":"Bb","D#":"Eb","F#":"Gb","C#":"Db"},Dm:{"A#":"Bb","D#":"Eb","F#":"Gb","G#":"Ab","C#":"Db"},Em:{"A#":"Bb","D#":"Eb","C#":"Db"},"F#m":{"A#":"Bb","D#":"Eb",Gb:"F#",Ab:"G#",Db:"C#"},Fm:{"G#":"Ab","A#":"Bb","D#":"Eb","F#":"Gb","C#":"Db"},Gm:{"G#":"Ab","A#":"Bb","D#":"Eb","C#":"Db","F#":"Gb"},"G#m":{Bb:"A#",Eb:"D#"},B:{Eb:"D#"},Lab:{Si:"Dob"},Dob:{Si:"Dob","La#":"Sib",Mi:"Fab"},Do:{"Do#":"Reb","Re#":"Mib","Fa#":"Solb","Sol#":"Lab","La#":"Sib"},"Do#":{Mib:"Re#",Sib:"La#"},Reb:{Si:"Dob","Fa#":"Solb"},Re:{"Re#":"Mib","La#":"Sib",Solb:"Fa#"},Mib:{"Re#":"Mib","Fa#":"Solb","Sol#":"Lab","La#":"Sib"},Mi:{Lab:"Sol#","La#":"Sib","Re#":"Mib",Reb:"Do#",Mib:"Re#"},Fa:{"La#":"Sib","Fa#":"Solb","Re#":"Mib","Sol#":"Lab"},"Fa#":{Sib:"La#",Mib:"Re#"},Solb:{"La#":"Sib","Re#":"Mib","Sol#":"Lab",Si:"Dob",Mi:"Fab"},Sol:{"La#":"Sib","Re#":"Mib","Sol#":"Lab","Do#":"Reb"},"Sol#":{"La#":"Sib","Re#":"Mib",Dob:"Si#"},Lam:{"Sol#":"Lab","Fa#":"Solb","Do#":"Reb","Re#":"Mib","La#":"Sib"},Sibm:{Dob:"Si",Solb:"Fa#"},Sim:{"La#":"Sib","Re#":"Mib"},"Do#m":{"La#":"Sib","Re#":"Mib",Solb:"Fa#"},Dom:{"Sol#":"Lab","La#":"Sib","Re#":"Mib","Fa#":"Solb","Do#":"Reb"},Rem:{"La#":"Sib","Re#":"Mib","Fa#":"Solb","Sol#":"Lab","Do#":"Reb"},Mim:{"La#":"Sib","Re#":"Mib","Do#":"Reb"},"Fa#m":{"La#":"Sib","Re#":"Mib",Solb:"Fa#",Lab:"Sol#",Reb:"Do#"},Fam:{"Sol#":"Lab","La#":"Sib","Re#":"Mib","Fa#":"Solb","Do#":"Reb"},Solm:{"Sol#":"Lab","La#":"Sib","Re#":"Mib","Do#":"Reb","Fa#":"Solb"},"Sol#m":{Sib:"La#",Mib:"Re#"},Si:{Mib:"Re#"}},bc=dc,ot="bridge",Ts="chorus",li="grid",pc="indeterminate",Xs="none",ui="tab",ct="verse",Zt="part",mi="ly",gi="abc",hi="svg",di="textblock",Te="symbol",ve="numeric",Be="numeral",Oe="solfege";var bn=["I","II","III","IV","V","VI","VII"],te="b",ae="#",Zs="NM",ge=Zs,xe="m",Ee="M";var Js="start_tag",Qs="end_tag",In="auto",Rt="german",_n=Symbol.for("chordsheetjs.ChordLyricsPair"),zn=Symbol.for("chordsheetjs.Comment"),On=Symbol.for("chordsheetjs.Literal"),Wn=Symbol.for("chordsheetjs.SoftLineBreak"),Hn=Symbol.for("chordsheetjs.Tag");function ft(r,s){Object.defineProperty(r,s,{value:!0,enumerable:!1,configurable:!1})}function lt(r,s){return!!(r&&typeof r=="object"&&r[s]===!0)}var It=class r{static[Symbol.hasInstance](s){return lt(s,_n)}constructor(s="",e=null,a=null,f=null,l=!1){this.parentLine=null,this._chordObj=null,this.chords=s||"",this.lyrics=e||"",this.annotation=a||"",this._chordObj=f,this.isRhythmSymbol=l}get chord(){return this._chordObj||nt.parse(this.chords.trim())}isRenderable(){return!0}hasLyrics(){return!!(this.lyrics&&this.lyrics.trim().length>0)}clone(){var e;let s=((e=this._chordObj)==null?void 0:e.clone())||null;return new r(this.chords,this.lyrics,this.annotation,s,this.isRhythmSymbol)}toString(){return`ChordLyricsPair(chords=${this.chords}, lyrics=${this.lyrics})`}set({chords:s,lyrics:e,annotation:a,chordObj:f,isRhythmSymbol:l}){return new r(s!=null?s:this.chords,e!=null?e:this.lyrics,a!=null?a:this.annotation,f!=null?f:null,l!=null?l:this.isRhythmSymbol)}setLyrics(s){return this.set({lyrics:s})}setAnnotation(s){return this.set({annotation:s})}transpose(s,e=null,{normalizeChordSuffix:a}={normalizeChordSuffix:!1}){return this.changeChord(f=>{let l=f.transpose(s);return e?l.normalize(e,{normalizeSuffix:a}):l})}useAccidental(s){return this.changeChord(e=>e.useAccidental(s))}useModifier(s){return Je("useModifier is deprecated, use useAccidental instead"),this.useAccidental(s)}changeChord(s){let e=this.chord;if(e){let a=s(e);return this.set({chords:a.toString(),chordObj:a})}return this.clone()}};ft(It.prototype,_n);var we=It,$c={2:"2",4:"sus",5:"5",6:"6",7:"7",9:"9",11:"11",13:"13",42:"4(2)",69:"6(9)","(#4)":"(#4)","#4":"(#4)","+4":"(#4)","(+4)":"(#4)","(11)":"(11)",add11:"(11)","(add11)":"(11)","(13)":"(13)",add13:"(13)","(add13)":"(13)","(2)":"(2)",add2:"(2)","(add2)":"(2)","(4)":"(4)",add4:"(4)","(add4)":"(4)","sus(4)":"(4)","(6)":"(6)",add6:"(6)","(add6)":"(6)","(7)":"(7)","(9)":"(9)",add9:"(9)","(add9)":"(9)","(b5)":"(b5)","-5":"(b5)","(-5)":"(b5)",b5:"(b5)","2(6)":"2(6)","(b6)":"(b6)","(unis)":"(unis)",unis:"(unis)","[blank]":"[blank]",maj:"[blank]",major:"[blank]",M:"[blank]",ma:"[blank]",Ma:"[blank]",Majj:"[blank]","+":"+",aug:"+","(#5)":"+","#5":"+","+5":"+","(+5)":"+",x:"+",dom11:"11","11(#5)":"11(#5)","11#5":"11(#5)","11+5":"11(#5)","11(+5)":"11(#5)","11(#9)":"11(#9)","11#9":"11(#9)","11+9":"11(#9)","11(+9)":"11(#9)","11(b13)":"11(b13)","11b13":"11(b13)","11-13":"11(b13)","11(-13)":"11(b13)","11(b5)":"11(b5)","11b5":"11(b5)","11-5":"11(b5)","11(-5)":"11(b5)","11(b9)":"11(b9)","11b9":"11(b9)","11-9":"11(b9)","11(-9)":"11(b9)","11sus4":"11sus4","11sus":"11sus4",m11sus4:"11sus4",m11sus:"11sus4",dom13:"13","13(#11)":"13(#11)","13#11":"13(#11)","13+11":"13(#11)","13(+11)":"13(#11)","13(#5)":"13(#5)","13#5":"13(#5)","13+5":"13(#5)","13(+5)":"13(#5)","13(#9)":"13(#9)","13#9":"13(#9)","13(+9)":"13(#9)","13+9":"13(#9)","13(#9#5)":"13(#9#5)","13#9#5":"13(#9#5)","13(+9+5)":"13(#9#5)","13+9+5":"13(#9#5)","13(#9b5)":"13(#9b5)","13#9b5":"13(#9b5)","13(+9-5)":"13(#9b5)","13+9-5":"13(#9b5)","13(add2)":"13(add2)","13(add4)":"13(add4)","13(b5)":"13(b5)","13b5":"13(b5)","13-5":"13(b5)","13(-5)":"13(b5)","13(b9)":"13(b9)","13b9":"13(b9)","13-9":"13(b9)","13(-9)":"13(b9)","13(b9#5)":"13(b9#5)","13b9#5":"13(b9#5)","13-9+5":"13(b9#5)","13(-9+5)":"13(b9#5)","13(b9b5)":"13(b9b5)","13b9b5":"13(b9b5)","13-9-5":"13(b9b5)","13(-9-5)":"13(b9b5)","13sus4":"13sus4","13sus":"13sus4",m13sus4:"13sus4",m13sus:"13sus4",sus2:"2","add9(no3)":"2","2(#11)":"2(#11)","2(#4)":"2(#4)","2+4":"2(#4)","2#4":"2(#4)","2(+4)":"2(#4)","(#4)2":"2(#4)","2(#4)(#42)(2#4)":"2(#4)(#42)(2#4)","2(+7)":"2(+7)","2(4)":"2(4)","sus2(4)":"2(4)","2(ma7)":"2(ma7)","2(no3)":"2(no3)","4(2)":"4(2)",sus42:"4(2)",no3:"5","(no3)":"5","5(no3)":"5","6(2)":"6(2)","6(b9)":"6(b9)","6(no3)":"6(no3)","6(9)":"6(9)","6(add9)":"6(9)",dom7:"7","7(#11)":"7(#11)","7#11":"7(#11)","7+11":"7(#11)","7(+11)":"7(#11)","7(#5)":"7(#5)",aug7:"7(#5)","7#5":"7(#5)","7+5":"7(#5)","7(+5)":"7(#5)",x7:"7(#5)","7(#5#11)":"7(#5#11)","7#5#11":"7(#5#11)","7+5+11":"7(#5#11)","7(+5+11)":"7(#5#11)","7(#9)":"7(#9)","7#9":"7(#9)","7+9":"7(#9)","7(+9)":"7(#9)","7(#9#5)":"7(#9#5)","7(#5#9)":"7(#9#5)","7#5#9":"7(#9#5)","7+5+9":"7(#9#5)","7(+5+9)":"7(#9#5)","7(#9b13)":"7(#9b13)","7#9b13":"7(#9b13)","7(+9-13)":"7(#9b13)","7+9-13":"7(#9b13)","7(b13#9)":"7(#9b13)","7b13#9":"7(#9b13)","7-13+9":"7(#9b13)","7(-13+9)":"7(#9b13)","7(#9b5)":"7(#9b5)","7(6)":"7(6)","7(b13)":"7(b13)","7b13":"7(b13)","7-13":"7(b13)","7(-13)":"7(b13)","7(b5)":"7(b5)","7b5":"7(b5)","7-5":"7(b5)","7(-5)":"7(b5)","7(b5#11)":"7(b5#11)","7b5#11":"7(b5#11)","7-5+11":"7(b5#11)","7(-5+11)":"7(b5#11)","7(b5#9)":"7(b5#9)","7b5#9":"7(b5#9)","7-5+9":"7(b5#9)","7(-5+9)":"7(b5#9)","7(b5b9)":"7(b5b9)","7b5b9":"7(b5b9)","7-5-9":"7(b5b9)","7(-5-9)":"7(b5b9)","7(b9)":"7(b9)","7b9":"7(b9)","7-9":"7(b9)","7(-9)":"7(b9)","7(b9#5)":"7(b9#5)","7(#5b9)":"7(b9#5)","7#5b9":"7(b9#5)","7+5-9":"7(b9#5)","7(+5-9)":"7(b9#5)","7(b9b13)":"7(b9b13)","7b9b13":"7(b9b13)","7-9-13":"7(b9b13)","7(-9-13)":"7(b9b13)","7(b13b9)":"7(b9b13)","7b13b9":"7(b9b13)","7-13-9":"7(b9b13)","7(-13-9)":"7(b9b13)","7(b9b5)":"7(b9b5)","7(no3)":"7(no3)","7aug5":"7aug5","7b9sus4":"7b9sus4","7sus(6)":"7sus(6)","7sus(b9)":"7sus(b9)","7sus4":"7sus4","7sus":"7sus4",dom9:"9","9(#11)":"9(#11)","9#11":"9(#11)","9+11":"9(#11)","9(+11)":"9(#11)","9(#5)":"9(#5)","9#5":"9(#5)","9+5":"9(#5)","9(+5)":"9(#5)",aug9:"9(#5)",x9:"9(#5)","9(b13)":"9(b13)","9b13":"9(b13)","9-13":"9(b13)","9(-13)":"9(b13)","9(b5)":"9(b5)","9b5":"9(b5)","9-5":"9(b5)","9(-5)":"9(b5)","9aug":"9aug","9sus4":"9sus4","9sus":"9sus4",m9sus4:"9sus4",m9sus:"9sus4","b69(#11)":"b69(#11)",b69sus:"b69sus",b9sus:"b9sus",dim:"dim","m(b5)":"dim",mb5:"dim","m-5":"dim","m(-5)":"dim","-(b5)":"dim","-b5":"dim",dim7:"dim7",o7:"dim7",m:"m",mi:"m",min:"m",minor:"m","-":"m","m(11)":"m(11)","m(add11)":"m(11)","m(4)":"m(4)","m(add4)":"m(4)","m(9)":"m(9)","m(add9)":"m(9)","m(ma7)":"m(ma7)","m(M7)":"m(ma7)",mM7:"m(ma7)","mi(maj7)":"m(ma7)","min(maj7)":"m(ma7)","m(maj7)":"m(ma7)","m(+7)":"m(ma7)","m+7":"m(ma7)",mmaj7:"m(ma7)","m(ma9)":"m(ma9)","m(M9)":"m(ma9)",mM9:"m(ma9)","mi(maj9)":"m(ma9)","min(maj9)":"m(ma9)","m(maj9)":"m(ma9)","m(+9)":"m(ma9)","m+9":"m(ma9)","m(no5)":"m(no5)",m11:"m11",mi11:"m11",min11:"m11","-11":"m11","m11(#5)":"m11(#5)","m11#5":"m11(#5)","m11+5":"m11(#5)","m11(+5)":"m11(#5)","-11(#5)":"m11(#5)","-11#5":"m11(#5)","m9+5":"m9(#5)","-11(+5)":"m11(#5)","m11(#9)":"m11(#9)","m11#9":"m11(#9)","m11+9":"m11(#9)","m11(+9)":"m11(#9)","-11(#9)":"m11(#9)","-11#9":"m11(#9)","-11+9":"m11(#9)","-11(+9)":"m11(#9)","m11(#9#5)":"m11(#9#5)","m11(#5#9)":"m11(#9#5)","m11#5#9":"m11(#9#5)","m11+5+9":"m11(#9#5)","m11(+5+9)":"m11(#9#5)","-11(#5#9)":"m11(#9#5)","-11#5#9":"m11(#9#5)","m9+5+9":"m11(#9#5)","-11(+5+9)":"m11(#9#5)","m11(#9b13)":"m11(#9b13)","m11#9b13":"m11(#9b13)","m11+9-13":"m11(#9b13)","m11(+9-13)":"m11(#9b13)","-11(#9b13)":"m11(#9b13)","-11#9b13":"m11(#9b13)","-11+9-13":"m11(#9b13)","-11(+9-13)":"m11(#9b13)","m11(b13)":"m11(b13)",m11b13:"m11(b13)","m11-13":"m11(b13)","m11(-13)":"m11(b13)","-11(b13)":"m11(b13)","-11b13":"m11(b13)","-11-13":"m11(b13)","-11(-13)":"m11(b13)","m11(b13#5)":"m11(b13#5)","m11(#5b13)":"m11(b13#5)","m11#5b13":"m11(b13#5)","m11+5-13":"m11(b13#5)","m11(+5-13)":"m11(b13#5)","-11(#5b13)":"m11(b13#5)","-11#5b13":"m11(b13#5)","-11+5-13":"m11(b13#5)","-11(+5-13)":"m11(b13#5)","m11(b5)":"m11(b5)",m11b5:"m11(b5)","m11-5":"m11(b5)","m11(-5)":"m11(b5)","-11(b5)":"m11(b5)","-11b5":"m11(b5)","-9-5":"m9(b5)","-11(-5)":"m11(b5)","m11(b5#9)":"m11(b5#9)","m11b5#9":"m11(b5#9)","m11-5+9":"m11(b5#9)","m11(-5+9)":"m11(b5#9)","-11(b5#9)":"m11(b5#9)","-11b5#9":"m11(b5#9)","-11-5+9":"m11(b5#9)","-11(-5+9)":"m11(b5#9)","m11(b5b13)":"m11(b5b13)",m11b5b13:"m11(b5b13)","m11(-5-13)":"m11(b5b13)","m11-5-13":"m11(b5b13)","-11(b5b13)":"m11(b5b13)","-11b5b13":"m11(b5b13)","-11(-5-13)":"m11(b5b13)","-11-5-13":"m11(b5b13)","m11(b5b9)":"m11(b5b9)",m11b5b9:"m11(b5b9)","m11-5-9":"m11(b5b9)","m11(-5-9)":"m11(b5b9)","-11(b5b9)":"m11(b5b9)","-11b5b9":"m11(b5b9)","-11-5-9":"m11(b5b9)","-11(-5-9)":"m11(b5b9)","m11(b9)":"m11(b9)",m11b9:"m11(b9)","m11(-9)":"m11(b9)","m11-9":"m11(b9)","-11(b9)":"m11(b9)","-11b9":"m11(b9)","-11(-9)":"m11(b9)","-11-9":"m11(b9)","m11(b9#5)":"m11(b9#5)","m11(#5b9)":"m11(b9#5)","m11#5b9":"m11(b9#5)","m11+5-9":"m11(b9#5)","m11(+5-9)":"m11(b9#5)","-11(#5b9)":"m11(b9#5)","-11#5b9":"m11(b9#5)","m9+5-9":"m11(b9#5)","-11(+5-9)":"m11(b9#5)","m11(b9b13)":"m11(b9b13)",m11b9b13:"m11(b9b13)","m11(-9-13)":"m11(b9b13)","m11-9-13":"m11(b9b13)","-11(b9b13)":"m11(b9b13)","-11b9b13":"m11(b9b13)","-11(-9-13)":"m11(b9b13)","-11-9-13":"m11(b9b13)",m13:"m13",mi13:"m13",min13:"m13","-13":"m13","m13(#11)":"m13(#11)","m13#11":"m13(#11)","m13+11":"m13(#11)","m13(+11)":"m13(#11)","-13(#11)":"m13(#11)","-13#11":"m13(#11)","-13+11":"m13(#11)","-13(+11)":"m13(#11)","m13(#5)":"m13(#5)","m13#5":"m13(#5)","m13+5":"m13(#5)","m13(+5)":"m13(#5)","-13(#5)":"m13(#5)","-13#5":"m13(#5)","-13(+5)":"m13(#5)","m13(#9)":"m13(#9)","m13#9":"m13(#9)","m13(+9)":"m13(#9)","m13+9":"m13(#9)","-13(#9)":"m13(#9)","-13#9":"m13(#9)","-13(+9)":"m13(#9)","-13+9":"m13(#9)","m13(b5)":"m13(b5)",m13b5:"m13(b5)","m13-5":"m13(b5)","m13(-5)":"m13(b5)","-13(b5)":"m13(b5)","-13b5":"m13(b5)","-13-5":"m13(b5)","-13(-5)":"m13(b5)","m13(b9)":"m13(b9)",m13b9:"m13(b9)","m13-9":"m13(b9)","m13(-9)":"m13(b9)","-13(b13)":"m13(b9)","-13b13":"m13(b9)","-13-13":"m13(b9)","-13(-13)":"m13(b9)",m2:"m2",mi2:"m2",min2:"m2","m(add2)":"m2",madd2:"m2",m4:"m4",m6:"m6",mi6:"m6",min6:"m6","-6":"m6","m6(#5)":"m6(#5)","m6(9)":"m6(9)",m6add9:"m6(9)","m6(add9)":"m6(9)",m69:"m6(9)","m6(ma7)":"m6(ma7)","m6(M7)":"m6(ma7)","m6(+7)":"m6(ma7)",m6M7:"m6(ma7)","m6+7":"m6(ma7)",m7:"m7",mi7:"m7",min7:"m7","-7":"m7","m7(#11)":"m7(#11)","m7#11":"m7(#11)","m7+11":"m7(#11)","m7(+11)":"m7(#11)","-7(#11)":"m7(#11)","-7#11":"m7(#11)","-7+11":"m7(#11)","-7(+11)":"m7(#11)","m7(#5)":"m7(#5)","m7#5":"m7(#5)","m7+5":"m7(#5)","m7(+5)":"m7(#5)","-7(#5)":"m7(#5)","-7#5":"m7(#5)","-7(+5)":"m7(#5)","m7(#9)":"m7(#9)","m7#9":"m7(#9)","m7+9":"m7(#9)","m7(+9)":"m7(#9)","-7(#9)":"m7(#9)","-7#9":"m7(#9)","-7(+9)":"m7(#9)","m7(11)":"m7(11)","m7(4)":"m7(4)","m7(add4)":"m7(4)","m7(add11)":"m7(4)",m74:"m7(4)","m7(6)":"m7(6)","m7(add6)":"m7(add6)","m7(b13)":"m7(b13)",m7b13:"m7(b13)","m7-13":"m7(b13)","m7(-13)":"m7(b13)","-7(b13)":"m7(b13)","-7b13":"m7(b13)","-7-13":"m7(b13)","-7(-13)":"m7(b13)","m7(b5)":"m7(b5)",m7b5:"m7(b5)","m7-5":"m7(b5)","m7(-5)":"m7(b5)","-7(b5)":"m7(b5)","-7b5":"m7(b5)","-7(-5)":"m7(b5)","m7(b9)":"m7(b9)",m7b9:"m7(b9)","m7-9":"m7(b9)","m7(-9)":"m7(b9)","-7(b9)":"m7(b9)","-7b9":"m7(b9)","-7(-9)":"m7(b9)","m7(no3)":"m7(no3)","min7(no3)":"m7(no3)",m7sus4:"m7sus4",m7sus:"m7sus4",m9:"m9",mi9:"m9",min9:"m9","-9":"m9","m9(#11)":"m9(#11)","m9#11":"m9(#11)","m9+11":"m9(#11)","m9(+11)":"m9(#11)","-9(#11)":"m9(#11)","-9#11":"m9(#11)","-9+11":"m9(#11)","-9(+11)":"m9(#11)","m9(#5)":"m9(#5)","m9#5":"m9(#5)","m9(+5)":"m9(#5)","-9(#5)":"m9(#5)","-9#5":"m9(#5)","-9(+5)":"m9(#5)","m9(#7)":"m9(#7)","m9(b13)":"m9(b13)",m9b13:"m9(b13)","m9-13":"m9(b13)","m9(-13)":"m9(b13)","-9(b13)":"m9(b13)","-9b13":"m9(b13)","-9-13":"m9(b13)","-9(-13)":"m9(b13)","m9(b5)":"m9(b5)",m9b5:"m9(b5)","m9-5":"m9(b5)","m9(-5)":"m9(b5)","-9(b5)":"m9(b5)","-9b5":"m9(b5)","-9(-5)":"m9(b5)","m9(ma7)":"m9(ma7)","m9(maj7)":"m9(ma7)","m9(+7)":"m9(ma7)","m9(M7)":"m9(ma7)",m9M7:"m9(ma7)",ma9:"ma9",maj9:"ma9",maj9b11:"maj9b11",ma11:"ma11","11(#7)":"ma11","11#7":"ma11","11+7":"ma11","11(+7)":"ma11","+11":"ma11",M11:"ma11","ma11(#5)":"ma11(#5)","maj11#5":"ma11(#5)","maj11+5":"ma11(#5)","maj11(+5)":"ma11(#5)","+11(#5)":"ma11(#5)","+11#5":"ma11(#5)","M11+5":"ma11(#5)","+11(+5)":"ma11(#5)","maj11(#5)":"ma11(#5)","ma11#5":"ma11(#5)","ma11+5":"ma11(#5)","ma11(+5)":"ma11(#5)","ma11(#9)":"ma11(#9)","maj11#9":"ma11(#9)","maj11+9":"ma11(#9)","maj11(+9)":"ma11(#9)","+11(#9)":"ma11(#9)","+11#9":"ma11(#9)","M11+9":"ma11(#9)","+11(+9)":"ma11(#9)","maj11(#9)":"ma11(#9)","ma11#9":"ma11(#9)","ma11+9":"ma11(#9)","ma11(+9)":"ma11(#9)","ma11(b13)":"ma11(b13)",maj11b13:"ma11(b13)","maj11-13":"ma11(b13)","maj11(-13)":"ma11(b13)","+11(b13)":"ma11(b13)","+11b13":"ma11(b13)","M11-13":"ma11(b13)","+11(-13)":"ma11(b13)","maj11(b13)":"ma11(b13)",ma11b13:"ma11(b13)","ma11-13":"ma11(b13)","ma11(-13)":"ma11(b13)","ma11(b5)":"ma11(b5)",maj11b5:"ma11(b5)","maj11-5":"ma11(b5)","maj11(-5)":"ma11(b5)","+11(b5)":"ma11(b5)","+11b5":"ma11(b5)","M11-5":"ma11(b5)","+11(-5)":"ma11(b5)","maj11(b5)":"ma11(b5)",ma11b5:"ma11(b5)","ma11-5":"ma11(b5)","ma11(-5)":"ma11(b5)","ma11(b9)":"ma11(b9)",maj11b9:"ma11(b9)","maj11(-9)":"ma11(b9)","maj11-9":"ma11(b9)","+11(b9)":"ma11(b9)","+11b9":"ma11(b9)","M11(-9)":"ma11(b9)","+11-9":"ma11(b9)","maj11(b9)":"ma11(b9)",ma11b9:"ma11(b9)","ma11(-9)":"ma11(b9)","ma11-9":"ma11(b9)",ma13:"ma13","13(#7)":"ma13","+13":"ma13",M13:"ma13",maj13:"ma13",Maj13:"ma13","ma13(#11)":"ma13(#11)","maj13#11":"ma13(#11)","maj13+11":"ma13(#11)","maj13(+11)":"ma13(#11)","+13(#11)":"ma13(#11)","+13#11":"ma13(#11)","M13+11":"ma13(#11)","+13(+11)":"ma13(#11)","maj13(#11)":"ma13(#11)","ma7#11":"ma9(#11)","ma13+11":"ma13(#11)","ma13(+11)":"ma13(#11)","ma13(#11#5)":"ma13(#11#5)","maj13#11#5":"ma13(#11#5)","maj13+11+5":"ma13(#11#5)","maj13(+11+5)":"ma13(#11#5)","+13(#11#5)":"ma13(#11#5)","+13#11#5":"ma13(#11#5)","M13+11+5":"ma13(#11#5)","+13(+11+5)":"ma13(#11#5)","maj13(#11#5)":"ma13(#11#5)","ma7#11#5":"ma9(#11#5)","ma13+11+5":"ma13(#11#5)","ma13(+11+5)":"ma13(#11#5)","ma13(#5)":"ma13(#5)","maj13#5":"ma13(#5)","maj13+5":"ma13(#5)","maj13(+5)":"ma13(#5)","+13(#5)":"ma13(#5)","+13#5":"ma13(#5)","M13+5":"ma13(#5)","+13(+5)":"ma13(#5)","maj13(#5)":"ma13(#5)","ma13#5":"ma13(#5)","ma13+5":"ma13(#5)","ma13(+5)":"ma13(#5)","ma13(#9)":"ma13(#9)","maj13#9":"ma13(#9)","maj13(+9)":"ma13(#9)","maj13+9":"ma13(#9)","+13(#9)":"ma13(#9)","+13#9":"ma13(#9)","M13(+9)":"ma13(#9)","+13+9":"ma13(#9)","maj13(#9)":"ma13(#9)","ma13#9":"ma13(#9)","ma13(+9)":"ma13(#9)","ma13+9":"ma13(#9)","ma13(#9#5)":"ma13(#9#5)","maj13#9#5":"ma13(#9#5)","maj13(+9+5)":"ma13(#9#5)","maj13+9+5":"ma13(#9#5)","+13(#9#5)":"ma13(#9#5)","+13#9#5":"ma13(#9#5)","M13(+9+5)":"ma13(#9#5)","+13+9+5":"ma13(#9#5)","maj13(#9#5)":"ma13(#9#5)","ma7#9#5":"ma13(#9#5)","ma13(+9+5)":"ma13(#9#5)","ma13+9+5":"ma13(#9#5)","ma13(b5)":"ma13(b5)",maj13b5:"ma13(b5)","maj13-5":"ma13(b5)","maj13(-5)":"ma13(b5)","+13(b5)":"ma13(b5)","+13b5":"ma13(b5)","M13-5":"ma13(b5)","+13(-5)":"ma13(b5)","maj13(b5)":"ma13(b5)",ma13b5:"ma13(b5)","ma13-5":"ma13(b5)","ma13(-5)":"ma13(b5)","ma13(b9)":"ma13(b9)",maj13b9:"ma13(b9)","maj13-9":"ma13(b9)","maj13(-9)":"ma13(b9)","+13(b9)":"ma13(b9)","+13b9":"ma13(b9)","M13-9":"ma13(b9)","+13(-9)":"ma13(b9)","maj13(b9)":"ma13(b9)",ma13b9:"ma13(b9)","ma13-9":"ma13(b9)","ma13(-9)":"ma13(b9)","ma13(b9#5)":"ma13(b9#5)","maj13b9#5":"ma13(b9#5)","maj13-9+5":"ma13(b9#5)","maj13(-9+5)":"ma13(b9#5)","+13(b9#5)":"ma13(b9#5)","+13b9#5":"ma13(b9#5)","M13-9+5":"ma13(b9#5)","+13(-9+5)":"ma13(b9#5)","maj13(b9#5)":"ma13(b9#5)","ma7b9#5":"ma13(b9#5)","ma13-9+5":"ma13(b9#5)","ma13(-9+5)":"ma13(b9#5)",ma6:"ma6","ma6(9)":"ma6(9)",ma69:"ma6(9)",ma7:"ma7","+7":"ma7","#7":"ma7",M7:"ma7",Maj7:"ma7",maj7:"ma7","(triangle)":"ma7","ma7(#11)":"ma7(#11)","maj7#11":"ma7(#11)","maj7+11":"ma7(#11)","maj7(+11)":"ma7(#11)","+7(#11)":"ma7(#11)","+7#11":"ma7(#11)","M7+11":"ma7(#11)","+7(+11)":"ma7(#11)","maj7(#11)":"ma7(#11)","ma7+11":"ma7(#11)","ma7(+11)":"ma7(#11)","ma7(#4)":"ma7(#4)","ma7(#5)":"ma7(#5)","maj7#5":"ma7(#5)","maj7+5":"ma7(#5)","maj7(+5)":"ma7(#5)","+7(#5)":"ma7(#5)","+7#5":"ma7(#5)","M7+5":"ma7(#5)","+7(+5)":"ma7(#5)","maj7(#5)":"ma7(#5)","ma7#5":"ma7(#5)","ma7+5":"ma7(#5)","ma7(+5)":"ma7(#5)","aug(M7)":"ma7(#5)","aug(+7)":"ma7(#5)","aug(ma7)":"ma7(#5)","aug(maj7)":"ma7(#5)","ma7(#9)":"ma7(#9)","maj7#9":"ma7(#9)","maj7+9":"ma7(#9)","maj7(+9)":"ma7(#9)","+7(#9)":"ma7(#9)","+7#9":"ma7(#9)","M7+9":"ma7(#9)","+7(+9)":"ma7(#9)","maj7(#9)":"ma7(#9)","ma7#9":"ma7(#9)","ma7+9":"ma7(#9)","ma7(+9)":"ma7(#9)","ma7(b13)":"ma7(b13)",maj7b13:"ma7(b13)","maj7-13":"ma7(b13)","maj7(-13)":"ma7(b13)","+7(b13)":"ma7(b13)","+7b13":"ma7(b13)","M7-13":"ma7(b13)","+7(-13)":"ma7(b13)","maj7(b13)":"ma7(b13)",ma7b13:"ma9(b13)","ma7-13":"ma7(b13)","ma7(-13)":"ma7(b13)","ma7(b5)":"ma7(b5)",maj7b5:"ma7(b5)","maj7-5":"ma7(b5)","maj7(-5)":"ma7(b5)","+7(b5)":"ma7(b5)","+7b5":"ma7(b5)","M7-5":"ma7(b5)","+7(-5)":"ma7(b5)","maj7(b5)":"ma7(b5)",ma7b5:"ma7(b5)","ma7-5":"ma7(b5)","ma7(-5)":"ma7(b5)","ma7(b9)":"ma7(b9)",maj7b9:"ma7(b9)","maj7-9":"ma7(b9)","maj7(-9)":"ma7(b9)","+7(b9)":"ma7(b9)","+7b9":"ma7(b9)","M7-9":"ma7(b9)","+7(-9)":"ma7(b9)","maj7(b9)":"ma7(b9)",ma7b9:"ma7(b9)","ma7-9":"ma7(b9)","ma7(-9)":"ma7(b9)","ma7(no3)":"ma7(no3)","9(#7)":"ma9","+9":"ma9",M9:"ma9","ma9(#11)":"ma9(#11)","maj9#11":"ma9(#11)","maj9+11":"ma9(#11)","maj9(+11)":"ma9(#11)","+9(#11)":"ma9(#11)","+9#11":"ma9(#11)","M9+11":"ma9(#11)","+9(+11)":"ma9(#11)","maj9(#11)":"ma9(#11)","ma9+11":"ma9(#11)","ma9(+11)":"ma9(#11)","ma9(#11#5)":"ma9(#11#5)","maj9#11#5":"ma9(#11#5)","maj9+11+5":"ma9(#11#5)","maj9(+11+5)":"ma9(#11#5)","+9(#11#5)":"ma9(#11#5)","+9#11#5":"ma9(#11#5)","M9+11+5":"ma9(#11#5)","+9(+11+5)":"ma9(#11#5)","maj9(#11#5)":"ma9(#11#5)","ma9+11+5":"ma9(#11#5)","ma9(+11+5)":"ma9(#11#5)","ma9(#4)":"ma9(#4)","ma9(#5)":"ma9(#5)","maj9#5":"ma9(#5)","maj9+5":"ma9(#5)","maj9(+5)":"ma9(#5)","+9(#5)":"ma9(#5)","+9#5":"ma9(#5)","M9+5":"ma9(#5)","+9(+5)":"ma9(#5)","maj9(#5)":"ma9(#5)","ma9#5":"ma9(#5)","ma9+5":"ma9(#5)","ma9(+5)":"ma9(#5)","ma9(13)":"ma9(13)","ma9(b13)":"ma9(b13)",maj9b13:"ma9(b13)","maj9-13":"ma9(b13)","maj9(-13)":"ma9(b13)","+9(b13)":"ma9(b13)","+9b13":"ma9(b13)","M9-13":"ma9(b13)","+9(-13)":"ma9(b13)","maj9(b13)":"ma9(b13)","ma9-13":"ma9(b13)","ma9(-13)":"ma9(b13)","ma9(b13#5)":"ma9(b13#5)","maj9b13#5":"ma9(b13#5)","maj9-13+5":"ma9(b13#5)","maj9(-13+5)":"ma9(b13#5)","+9(b13#5)":"ma9(b13#5)","+9b13#5":"ma9(b13#5)","M9-13+5":"ma9(b13#5)","+9(-13+5)":"ma9(b13#5)","maj9(b13#5)":"ma9(b13#5)","ma7b13#5":"ma9(b13#5)","ma9-13+5":"ma9(b13#5)","ma9(-13+5)":"ma9(b13#5)","ma9(b5)":"ma9(b5)",maj9b5:"ma9(b5)","maj9-5":"ma9(b5)","maj9(-5)":"ma9(b5)","+9(b5)":"ma9(b5)","+9b5":"ma9(b5)","M9-5":"ma9(b5)","+9(-5)":"ma9(b5)","maj9(b5)":"ma9(b5)",ma9b5:"ma9(b5)","ma9-5":"ma9(b5)","ma9(-5)":"ma9(b5)",sus:"sus",sus4:"sus","sus(no5)":"sus(no5)","sus#42":"sus#42","":""},pn=$c,xc={[Te]:{[Ee]:{[ge]:{C:0,D:2,E:4,F:5,G:7,A:9,B:11},[ae]:{B:0,C:1,D:3,E:5,F:6,G:8,A:10},[te]:{D:1,E:3,F:4,G:6,A:8,B:10,C:11}},[xe]:{[ge]:{C:0,D:2,E:4,F:5,G:7,A:9,B:11},[ae]:{B:0,C:1,D:3,E:5,F:6,G:8,A:10},[te]:{D:1,E:3,F:4,G:6,A:8,B:10,C:11}}},[Oe]:{[Ee]:{[ge]:{Do:0,Re:2,Mi:4,Fa:5,Sol:7,La:9,Si:11},[ae]:{Si:0,Do:1,Re:3,Mi:5,Fa:6,Sol:8,La:10},[te]:{Re:1,Mi:3,Fa:4,Sol:6,La:8,Si:10,Do:11}},[xe]:{[ge]:{Do:0,Re:2,Mi:4,Fa:5,Sol:7,La:9,Si:11},[ae]:{Si:0,Do:1,Re:3,Mi:5,Fa:6,Sol:8,La:10},[te]:{Re:1,Mi:3,Fa:4,Sol:6,La:8,Si:10,Do:11}}},[ve]:{[Ee]:{[ge]:{1:0,2:2,3:4,4:5,5:7,6:9,7:11},[ae]:{7:0,1:1,2:3,3:5,4:6,5:8,6:10},[te]:{2:1,3:3,4:4,5:6,6:8,7:10,1:11}},[xe]:{[ge]:{1:0,2:2,3:3,4:5,5:7,6:8,7:10},[ae]:{1:1,2:3,3:4,4:6,5:8,6:9,7:11},[te]:{2:1,3:2,4:4,5:6,6:7,7:9,1:11}}},[Be]:{[Ee]:{[ge]:{I:0,II:2,III:4,IV:5,V:7,VI:9,VII:11},[ae]:{VII:0,I:1,II:3,III:5,IV:6,V:8,VI:10},[te]:{II:1,III:3,IV:4,V:6,VI:8,VII:10,I:11}},[xe]:{[ge]:{I:0,II:2,III:3,IV:5,V:7,VI:8,VII:10},[ae]:{I:1,II:3,III:4,IV:6,V:8,VI:9,VII:11},[te]:{II:1,III:2,IV:4,V:6,VI:7,VII:9,I:11}}}},yc={[Te]:{[Ee]:{[ge]:{0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"},[ae]:{0:"B#",1:"C#",3:"D#",5:"E#",6:"F#",8:"G#",10:"A#"},[te]:{1:"Db",3:"Eb",4:"Fb",6:"Gb",8:"Ab",10:"Bb",11:"Cb"}},[xe]:{[ge]:{0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"},[ae]:{0:"B#",1:"C#",3:"D#",5:"E#",6:"F#",8:"G#",10:"A#"},[te]:{1:"Db",3:"Eb",4:"Fb",6:"Gb",8:"Ab",10:"Bb",11:"Cb"}}},[Oe]:{[Ee]:{[ge]:{0:"Do",2:"Re",4:"Mi",5:"Fa",7:"Sol",9:"La",11:"Si"},[ae]:{0:"Si#",1:"Do#",3:"Re#",5:"Mi#",6:"Fa#",8:"Sol#",10:"La#"},[te]:{1:"Reb",3:"Mib",4:"Fab",6:"Solb",8:"Lab",10:"Sib",11:"Dob"}},[xe]:{[ge]:{0:"Do",2:"Re",4:"Mi",5:"Fa",7:"Sol",9:"La",11:"Si"},[ae]:{0:"Si#",1:"Do#",3:"Re#",5:"Mi#",6:"Fa#",8:"Sol#",10:"La#"},[te]:{1:"Reb",3:"Mib",4:"Fab",6:"Solb",8:"Lab",10:"Sib",11:"Dob"}}},[ve]:{[Ee]:{[ge]:{0:"1",2:"2",4:"3",5:"4",7:"5",9:"6",11:"7"},[ae]:{0:"#7",1:"#1",3:"#2",5:"#3",6:"#4",8:"#5",10:"#6"},[te]:{1:"b2",3:"b3",4:"b4",6:"b5",8:"b6",10:"b7",11:"b1"}},[xe]:{[ge]:{0:"1",2:"2",3:"3",5:"4",7:"5",8:"6",10:"7"},[ae]:{1:"#1",3:"#2",4:"#3",6:"#4",8:"#5",9:"#6",11:"#7"},[te]:{1:"b2",2:"b3",4:"b4",6:"b5",7:"b6",9:"b7",11:"b1"}}},[Be]:{[Ee]:{[ge]:{0:"I",2:"II",4:"III",5:"IV",7:"V",9:"VI",11:"VII"},[ae]:{0:"#VII",1:"#I",3:"#II",5:"#III",6:"#IV",8:"#V",10:"#VI"},[te]:{1:"bII",3:"bIII",4:"bIV",6:"bV",8:"bVI",10:"bVII",11:"bI"}},[xe]:{[ge]:{0:"I",2:"II",3:"III",5:"IV",7:"V",8:"VI",10:"VII"},[ae]:{1:"#I",3:"#II",4:"#III",6:"#IV",8:"#V",9:"#VI",11:"#VII"},[te]:{1:"bII",2:"bIII",4:"bIV",6:"bV",7:"bVI",9:"bVII",11:"bI"}}}};function Vn(r){return r==="H"||r==="h"}function Cc(r){return r==="H"?"B":r==="h"?"b":r}function $n(r){return r.startsWith("H")?`B${r.slice(1)}`:r}function Ac(r,s,e){return e===Rt&&s===null&&(r==="B"||r==="b")?te:null}function Sc(r,s){return s||(Vn(r)?Rt:null)}function Er(r,s,e,a){let f=xc[e][a?xe:Ee][s],l=e===Te?Cc(r):r;if(l in f)return f[l];let h=l.toUpperCase();return h in f?f[h]:null}function Kn(r){let s=globalThis.process;typeof s=="object"&&typeof s.emitWarning=="function"?s.emitWarning(r):console.warn(r)}function Je(r){try{throw new Error(`DEPRECATION: ${r}`)}catch(s){Kn(`${r}
${s.stack}`)}}function Ec(r){return r==null||r===""}function wc(r,s,e){switch(s){case Be:return typeof r=="string"&&r.toLowerCase()===r;default:return typeof e=="string"&&e[0]==="m"&&e.substring(0,2).toLowerCase()!=="ma"&&e.substring(0,3).toLowerCase()!=="maj"}}function Lc(r){return r.replace(/\r\n?/g,`
`)}var Mr=class{constructor(s){this.grades=s}determineGrade(s,e,a){return this.getGradeForAccidental(s,a)||this.getGradeForAccidental(Zs,a)||this.getGradeForAccidental(e,a)||this.getGradeForAccidental(ae,a)}getGradeForAccidental(s,e){return s?this.grades[s][e]:null}};function Fc({type:r,accidental:s,preferredAccidental:e,grade:a,minor:f}){let l=f?xe:Ee,h=yc[r][l];return new Mr(h).determineGrade(s,e,a)}function vc(r){let{type:s,accidental:e,preferredAccidental:a,grade:f,minor:l}=r,h=Fc({type:s,accidental:e,preferredAccidental:a,grade:f,minor:l});if(!h)throw new Error(`Could not resolve ${r} to a key`);return l&&s===Be&&(h=h.toLowerCase()),h}function Pt(r){return r===null||pn[r]==="[blank]"?null:pn[r]||r}var qn;function Dc(r,s){let e={...r};return Object.keys(s).forEach(a=>{let f=r[a],l=s[a];f&&typeof f=="object"&&!Array.isArray(f)&&l&&typeof l=="object"&&!Array.isArray(l)?e[a]=qn(f,l):e[a]=l}),e}qn=(r,s)=>s==null?r:r==null||typeof r!="object"||typeof s!="object"||Array.isArray(s)?s:Dc(r,s);function Tc(r,s){return Object.fromEntries(Object.entries(r).filter(([e,a])=>s(e,a)))}var Mc={symbol:/^(?<key>((?<note>[A-Ha-h])(?<accidental>#|b)?))(?<minor>m)?$/,solfege:/^(?<key>((?<note>Do|Re|Mi|Fa|Sol|La|Si|do|re|mi|fa|sol|la|si)(?<accidental>#|b)?))(?<minor>m)?$/,numeric:/^(?<key>(?<accidental>#|b)?(?<note>[1-7]))(?<minor>m)?$/,numeral:/^(?<key>(?<accidental>#|b)?(?<note>I{1,3}|IV|VI{0,2}|i{1,3}|iv|vi{0,2}))$/},xn=[Te,Oe,ve,Be],Gc=[1,2,3,4,5,8,9,10],Bc=[4,11],jc=[1,4],Pc=[5,0],kc=[3,7],yn=[2,3,10],Gr=class r{get unicodeAccidental(){switch(this.accidental){case te:return"\u266D";case ae:return"\u266F";default:return null}}get unicodeModifier(){return Je("unicodeModifier is deprecated, use unicodeAccidental instead"),this.unicodeAccidental}get modifier(){return Je("modifier is deprecated, use accidental instead"),this.accidental}get preferredModifier(){return Je("preferredModifier is deprecated, use preferredAccidental instead"),this.preferredAccidental}static parse(s){if(!s)return null;let e=s.trim();if(!e)return null;for(let a=0,f=xn.length;a<f;a+=1){let l=this.parseAsType(e,xn[a]);if(l)return l}return null}static parseAsType(s,e){let a=s.match(Mc[e]);if(!a)return null;let{minor:f,note:l,accidental:h}=a.groups;return this.resolve({key:l,keyType:e,minor:f||!1,accidental:h||null,preferredNotation:e===Te&&Vn(l)?Rt:null})}static resolve({key:s,keyType:e,minor:a,accidental:f,preferredNotation:l}){var F;let h=`${s}`,S=this.isMinor(h,e,a),D=Sc(h,l),A=(F=Ac(h,f,D))!=null?F:f,x=e===Te||e===Oe?Er(h,A||Zs,e,S):null;return x!==null?new r({grade:0,minor:S,type:e,accidental:f||null,preferredAccidental:f||null,referenceKeyGrade:x,originalKeyString:h,preferredNotation:D}):new r({number:this.getNumberFromKey(h,e),minor:S,type:e,accidental:f||null,preferredAccidental:f||null,originalKeyString:h})}static getNumberFromKey(s,e){if(e===ve)return parseInt(s,10);let a=s.toUpperCase();return bn.findIndex(f=>a===f)+1}static keyWithAccidental(s,e,a){let f=s.toUpperCase(),l=e||"";return a===Oe?`${s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()}${l}`:a===Te?`${f}${l}`:`${l}${f}`}static keyWithModifier(s,e,a){return Je("keyWithModifier is deprecated, use keyWithAccidental instead"),this.keyWithAccidental(s,e,a)}static isMinor(s,e,a){switch(e){case"numeral":return s.toLowerCase()===s;default:switch(typeof a){case"string":return a==="m"||a.toLowerCase()==="min";case"boolean":return a;default:return!1}}}static parseOrFail(s){let e=this.parse(s);if(!e)throw new Error(`Failed to parse ${s}`);return e}static wrap(s){return s instanceof r?s:s===null?null:this.parse(s)}static wrapOrFail(s=null){if(s===null)throw new Error("Unexpected null key");let e=this.wrap(s);if(e===null)throw new Error(`Failed: invalid key ${s}`);return e}static toString(s){return`${r.wrapOrFail(s)}`}static distance(s,e){return this.wrapOrFail(s).distanceTo(e)}constructor({grade:s=null,number:e=null,minor:a,type:f,accidental:l,referenceKeyGrade:h=null,referenceKeyMode:S=null,originalKeyString:D=null,preferredAccidental:A=null,explicitAccidental:x=!1,preferredNotation:F=null}){this.number=null,this.minor=!1,this.referenceKeyGrade=null,this.referenceKeyMode=null,this.originalKeyString=null,this.explicitAccidental=!1,this.preferredNotation=null,this.grade=s,this.number=e,this.minor=a,this.type=f,this.accidental=l,this.preferredAccidental=A,this.referenceKeyGrade=h,this.referenceKeyMode=S,this.originalKeyString=D,this.explicitAccidental=x,this.preferredNotation=F}distanceTo(s){let e=r.wrapOrFail(s);return r.shiftGrade(e.effectiveGrade-this.effectiveGrade)}get effectiveGrade(){if(this.grade===null)throw new Error("Cannot calculate effectiveGrade without a grade");return r.shiftGrade(this.grade+(this.referenceKeyGrade||0))}isMinor(){return this.minor}makeMinor(){return this.set({minor:!0})}get relativeMajor(){return this.changeGrade(3).set({minor:!1})}get relativeMinor(){return this.changeGrade(-3).set({minor:!0})}toMajor(){return this.isMinor()?this.transpose(3).set({minor:!1}):this.clone()}clone(){return this.set({})}ensureGrade(){this.grade===null&&this.calculateGradeFromNumber()}calculateGradeFromNumber(){if(this.number===null)throw new Error("Cannot calculate grade, number is null");this.grade=Er(this.number.toString(),this.accidental||Zs,ve,this.isMinor()),this.number=null}toChordSymbol(s,e=!1){return this.isChordSymbol()?this.clone():this.convertToChordType(s,Te,e)}toChordSolfege(s,e=!1){return this.isChordSolfege()?this.clone():this.convertToChordType(s,Oe,e)}convertToChordType(s,e,a){let{accidental:f}=this,l=r.wrapOrFail(s);this.rebaseNumeralGradeForMajorReference(a),this.ensureGrade();let h=this.handleMinorKeyConversion(l,a);if(h)return h;let D=this.set({referenceKeyGrade:r.shiftGrade(this.effectiveGrade+l.effectiveGrade),grade:0,type:e,accidental:null,preferredAccidental:f||l.accidental}).normalizeEnharmonics(l);return f?D.set({preferredAccidental:f,accidental:null}):D}rebaseNumeralGradeForMajorReference(s){if(s||!this.minor||!this.originalKeyString||!(this.isNumeral()||this.isNumeric()))return;let e=r.getNumberFromKey(this.originalKeyString,this.type),a=e?Er(e.toString(),this.accidental||Zs,ve,!1):null;a!==null&&(this.grade=a,this.number=null)}handleMinorKeyConversion(s,e){return!(this.isNumeral()||this.isNumeric())||!e?null:this.grade===8?s.relativeMinor:this.grade===7?s.relativeMinor.changeGrade(-1):this.grade===9?s.relativeMinor.changeGrade(1):null}toChordSymbolString(s){return this.toChordSymbol(s).toString()}toChordSolfegeString(s){return this.toChordSolfege(s).toString()}is(s){return this.type===s}isNumeric(){return this.is(ve)}isChordSymbol(){return this.is(Te)}isChordSolfege(){return this.is(Oe)}isNumeral(){return this.is(Be)}equals(s){return this.grade===s.grade&&this.number===s.number&&this.accidental===s.accidental&&this.preferredAccidental===s.preferredAccidental&&this.type===s.type&&this.minor===s.minor}static equals(s,e){return s===null?e===null:e===null?!1:s.equals(e)}toNumeric(s=null){if(this.isNumeric())return this.clone();if(this.isNumeral())return this.set({type:ve});let e=r.wrapOrFail(s),a=e.effectiveGrade,f=e.minor?xe:Ee,l=r.shiftGrade(this.effectiveGrade-a),h=e.accidental;return yn.includes(l)&&(h=te),this.set({type:ve,grade:r.shiftGrade(this.effectiveGrade-a),referenceKeyGrade:0,accidental:null,preferredAccidental:h,referenceKeyMode:f})}toNumericString(s=null){return this.toNumeric(s).toString()}toNumeral(s=null){if(this.isNumeral())return this.clone();if(this.isNumeric())return this.set({type:Be});let e=r.wrapOrFail(s),a=e.effectiveGrade,f=e.minor?xe:Ee,l=r.shiftGrade(this.effectiveGrade-a),h=e.accidental;return yn.includes(l)&&(h=te),this.set({type:Be,grade:r.shiftGrade(this.effectiveGrade-a),referenceKeyGrade:0,accidental:null,preferredAccidental:h,referenceKeyMode:f})}toNumeralString(s=null){return this.toNumeral(s).toString()}toString({showMinor:s=!0,useUnicodeModifier:e=!1}={}){let{note:a}=this;return e&&(a=a.replace("#","\u266F").replace("b","\u266D")),`${a}${s?this.minorSign:""}`}get note(){if(this.grade===null)return this.getNoteForNumber();if((this.isChordSymbol()||this.isChordSolfege())&&this.referenceKeyGrade===null)throw new Error("Not possible, reference key grade is null");let{minor:s}=this;this.referenceKeyMode&&(s=this.referenceKeyMode===xe);let e=vc({type:this.type,accidental:this.accidental,preferredAccidental:this.preferredAccidental,grade:this.effectiveGrade,minor:s});return this.applyGermanRendering(e)}applyGermanRendering(s){return this.preferredNotation!==Rt||!this.isChordSymbol()?s:this.accidental===null&&this.effectiveGrade===10?"B":s==="B"?"H":s}getNoteForNumber(){if(this.number===null)throw new Error("Not possible, grade and number are null");if(this.isNumeric())return`${this.accidental||""}${this.number}`;let s=bn[this.number-1];return`${this.accidental||""}${this.isMinor()?s.toLowerCase():s}`}get minorSign(){if(!this.minor)return"";switch(this.type){case Te:return"m";case Oe:return"m";case ve:return this.isNaturalMinor()?"":"m";default:return""}}isNaturalMinor(){if(this.ensureGrade(),!this.grade)throw new Error("Expected grade to be set, but it is is still empty.");return Gc.includes(this.grade)}transpose(s){if(s===0)return this;let e=this.accidental,a=this.clone(),f=s<0?"transposeDown":"transposeUp";for(let l=0,h=Math.abs(s);l<h;l+=1)a=a[f]();return a.useAccidental(e)}changeGrade(s){return this.referenceKeyGrade?this.set({referenceKeyGrade:r.shiftGrade(this.referenceKeyGrade+s)}):(this.ensureGrade(),this.set({grade:r.shiftGrade(this.grade+s)}))}transposeUp(){let e=this.normalize().changeGrade(1);return this.accidental||!e.canBeSharp()?e=e.useAccidental(null):e.canBeSharp()&&(e=e.useAccidental(ae)),e=e.set({preferredAccidental:ae}).normalize(),e}transposeDown(){let e=this.normalize().changeGrade(-1);return this.accidental||!e.canBeFlat()?e=e.useAccidental(null):e.canBeFlat()&&(e=e.useAccidental(te)),e.set({preferredAccidental:te})}canBeFlat(){var a;let s=this.number!==null?jc:Bc,e=(a=this.number)!=null?a:this.effectiveGrade;return!s.includes(e)}canBeSharp(){var a;let s=this.number!==null?kc:Pc,e=(a=this.number)!=null?a:this.effectiveGrade;return!s.includes(e)}setGrade(s){return this.set({grade:r.shiftGrade(s)})}static shiftGrade(s){return s<0?this.shiftGrade(s+12):s%12}useAccidental(s){return this.ensureGrade(),this.set({accidental:s,explicitAccidental:s!==null})}useModifier(s){return Je("useModifier is deprecated, use useAccidental instead"),this.useAccidental(s)}normalize(){return this.ensureGrade(),this.accidental===ae&&!this.canBeSharp()?this.set({accidental:null}):this.accidental===te&&!this.canBeFlat()?this.set({accidental:null}):this.clone()}normalizeEnharmonics(s){if(s){if(this.explicitAccidental)return this.clone();let e=$n(r.wrapOrFail(s).toString({showMinor:!0})),a=bc[e],f=$n(this.toString({showMinor:!1}));if(a&&a[f])return r.parseOrFail(a[f]).set({minor:this.minor,preferredNotation:this.preferredNotation})}return this.clone()}set(s,e=!0){return new r({...e?{}:s,grade:this.grade,number:this.number,type:this.type,accidental:this.accidental,minor:this.minor,referenceKeyGrade:this.referenceKeyGrade,originalKeyString:this.originalKeyString,preferredAccidental:this.preferredAccidental,explicitAccidental:this.explicitAccidental,preferredNotation:this.preferredNotation,...e?s:{}})}},De=Gr;function wr(r,s,e){return e=e||" ",r.length>s?r:(s-=r.length,e+=e.repeat(s),r+e.slice(0,s))}var et=class r extends Error{static buildMessage(s,e){function a(A){return A.charCodeAt(0).toString(16).toUpperCase()}function f(A){return A.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function l(A){return A.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function h(A){switch(A.type){case"literal":return'"'+f(A.text)+'"';case"class":let x=A.parts.map(F=>Array.isArray(F)?l(F[0])+"-"+l(F[1]):l(F));return"["+(A.inverted?"^":"")+x+"]";case"any":return"any character";case"end":return"end of input";case"other":return A.description}}function S(A){let x=A.map(h),F,P;if(x.sort(),x.length>0){for(F=1,P=1;F<x.length;F++)x[F-1]!==x[F]&&(x[P]=x[F],P++);x.length=P}switch(x.length){case 1:return x[0];case 2:return x[0]+" or "+x[1];default:return x.slice(0,-1).join(", ")+", or "+x[x.length-1]}}function D(A){return A?'"'+f(A)+'"':"end of input"}return"Expected "+S(s)+" but "+D(e)+" found."}constructor(s,e,a,f){super(),this.message=s,this.expected=e,this.found=a,this.location=f,this.name="PeggySyntaxError",typeof Object.setPrototypeOf=="function"?Object.setPrototypeOf(this,r.prototype):this.__proto__=r.prototype,typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,r)}format(s){let e="Error: "+this.message;if(this.location){let a=null,f;for(f=0;f<s.length;f++)if(s[f].grammarSource===this.location.source){a=s[f].text.split(/\r\n|\n|\r/g);break}let l=this.location.start,h=this.location.source+":"+l.line+":"+l.column;if(a){let S=this.location.end,D=wr("",l.line.toString().length," "),A=a[l.line-1],x=l.line===S.line?S.column:A.length+1;e+=`
 --> `+h+`
`+D+` |
`+l.line+" | "+A+`
`+D+" | "+wr("",l.column-1," ")+wr("",x-l.column,"^")}else e+=`
 at `+h}return e}};function Nc(r,s){s=s!==void 0?s:{};let e={},a=s.grammarSource,f={Chord:$t},l=$t,h="(",S=X("(",!1),D=")",A=X(")",!1),x=function(u){return{type:"chord",...u,column:Ae().start.column,optional:!0}},F=function(u){return{type:"chord",...u,column:Ae().start.column}},P=/^[#b]/,j=as(["#","b"],!1,!1),H=function(u,p,E,M){let N=typeof E=="string"||E===null?{suffix:E}:{quality:E.quality,extensions:E.extensions};return{base:u,accidental:p,...N,...M,chordType:"symbol"}},ne=function(u){return{base:null,accidental:null,suffix:null,...u,chordType:"symbol"}},Z=/^[A-Ha-h]/,Y=as([["A","H"],["a","h"]],!1,!1),V="/",K=X("/",!1),re=function(u,p){return{bassBase:u,bassAccidental:p}},q=function(u,p,E,M){let N=typeof E=="string"||E===null?{suffix:E}:{quality:E.quality,extensions:E.extensions};return{base:u,accidental:p,...N,...M,chordType:"solfege"}},he=function(u){return{base:null,accidental:null,suffix:null,...u,chordType:"solfege"}},ye="do",Ce=X("Do",!0),ce="re",Pe=X("Re",!0),_="mi",ie=X("Mi",!0),de="sol",ke=X("Sol",!0),Gs="la",Ne=X("La",!0),ss="si",gs=X("Si",!0),J="Fa",se=X("Fa",!1),hs="dd",ts=X("dd",!0),He="ug",ds=X("ug",!0),Ve=function(){return"Fa"},Re="fa",Bs=X("fa",!1),js=function(){return"fa"},Ke=function(u,p,E,M){let N=typeof E=="string"||E===null?{suffix:E}:{quality:E.quality,extensions:E.extensions};return{base:p,accidental:u,...N,...M,chordType:"numeral"}},qe=function(u){return{base:null,accidental:null,suffix:null,...u,chordType:"numeral"}},v="iii",oe=X("III",!0),ee="vii",O=X("VII",!0),Ue="ii",U=X("II",!0),Ie="iv",Ye=X("IV",!0),gt="vi",ht=X("VI",!0),bs=/^[IV]/i,be=as(["I","V"],!1,!0),pe=function(u,p){return{bassBase:p,bassAccidental:u}},dt=function(u,p,E,M){let N=typeof E=="string"||E===null?{suffix:E}:{quality:E.quality,extensions:E.extensions};return{base:p,accidental:u,...N,...M,chordType:"numeric"}},Ps=function(u){return{base:null,accidental:null,suffix:null,...u,chordType:"numeric"}},rs=/^[1-7]/,ps=as([["1","7"]],!1,!1),Me=function(u,p){return{quality:u||null,extensions:p||null}},Q="m",$s=X("m",!1),xs="a",is=X("a",!0),ys=function(){return"m"},ks="dim",Ns=X("dim",!0),Cs="aug",Rs=X("aug",!0),Is="sus4",_s=X("sus4",!0),As="sus2",zs=X("sus2",!0),Os="sus",ns=X("sus",!0),Ws="",_e=/^[a-zA-Z0-9#+\-o\u266D\u266F\u0394]/,Xe=as([["a","z"],["A","Z"],["0","9"],"#","+","-","o","\u266D","\u266F","\u0394"],!1,!1),Hs=function(u){return"("+u+")"},m=0,W=0,Le=[{line:1,column:1}],d=0,C=[],L=0,B;if(s.startRule!==void 0){if(!(s.startRule in f))throw new Error(`Can't start parsing from rule "`+s.startRule+'".');l=f[s.startRule]}function le(){return r.substring(W,m)}function Ae(){return os(W,m)}function $e(u,p){throw p=p!==void 0?p:os(W,m),pt([ur(u)],r.substring(W,m),p)}function Ti(u,p){throw p=p!==void 0?p:os(W,m),mr(u,p)}function X(u,p){return{type:"literal",text:u,ignoreCase:p}}function as(u,p,E){return{type:"class",parts:u,inverted:p,ignoreCase:E}}function fr(){return{type:"any"}}function lr(){return{type:"end"}}function ur(u){return{type:"other",description:u}}function bt(u){let p=Le[u],E;if(p)return p;for(E=u-1;!Le[E];)E--;for(p=Le[E],p={line:p.line,column:p.column};E<u;)r.charCodeAt(E)===10?(p.line++,p.column=1):p.column++,E++;return Le[u]=p,p}function os(u,p){let E=bt(u),M=bt(p);return{source:a,start:{offset:u,line:E.line,column:E.column},end:{offset:p,line:M.line,column:M.column}}}function I(u){m<d||(m>d&&(d=m,C=[]),C.push(u))}function mr(u,p){return new et(u,[],"",p)}function pt(u,p,E){return new et(et.buildMessage(u,p),u,p,E)}function $t(){let u,p,E,M;return u=m,r.charCodeAt(m)===40?(p=h,m++):(p=e,L===0&&I(S)),p!==e?(E=qs(),E===e&&(E=Us(),E===e&&(E=Vs(),E===e&&(E=xt()))),E!==e?(r.charCodeAt(m)===41?(M=D,m++):(M=e,L===0&&I(A)),M!==e?(W=u,p=x(E),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=qs(),p===e&&(p=Us(),p===e&&(p=Vs(),p===e&&(p=xt()))),p!==e&&(W=u,p=F(p)),u=p),u}function Fe(){let u;return P.test(r.charAt(m))?(u=r.charAt(m),m++):(u=e,L===0&&I(j)),u}function xt(){let u,p,E,M,N;return u=m,p=yt(),p!==e?(E=Fe(),E===e&&(E=null),E!==e?(M=Ss(),M!==e?(N=Ct(),N===e&&(N=null),N!==e?(W=u,p=H(p,E,M,N),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=Ct(),p!==e&&(W=u,p=ne(p)),u=p),u}function yt(){let u;return Z.test(r.charAt(m))?(u=r.charAt(m),m++):(u=e,L===0&&I(Y)),u}function Ct(){let u,p,E,M;return u=m,r.charCodeAt(m)===47?(p=V,m++):(p=e,L===0&&I(K)),p!==e?(E=yt(),E!==e?(M=Fe(),M===e&&(M=null),M!==e?(W=u,p=re(E,M),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u}function Vs(){let u,p,E,M,N;return u=m,p=At(),p!==e?(E=Fe(),E===e&&(E=null),E!==e?(M=Ss(),M!==e?(N=Ks(),N===e&&(N=null),N!==e?(W=u,p=q(p,E,M,N),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=Ks(),p!==e&&(W=u,p=he(p)),u=p),u}function At(){let u;return r.substr(m,2).toLowerCase()===ye?(u=r.substr(m,2),m+=2):(u=e,L===0&&I(Ce)),u===e&&(r.substr(m,2).toLowerCase()===ce?(u=r.substr(m,2),m+=2):(u=e,L===0&&I(Pe)),u===e&&(r.substr(m,2).toLowerCase()===_?(u=r.substr(m,2),m+=2):(u=e,L===0&&I(ie)),u===e&&(u=St(),u===e&&(r.substr(m,3).toLowerCase()===de?(u=r.substr(m,3),m+=3):(u=e,L===0&&I(ke)),u===e&&(r.substr(m,2).toLowerCase()===Gs?(u=r.substr(m,2),m+=2):(u=e,L===0&&I(Ne)),u===e&&(r.substr(m,2).toLowerCase()===ss?(u=r.substr(m,2),m+=2):(u=e,L===0&&I(gs)))))))),u}function St(){let u,p,E,M;return u=m,r.substr(m,2)===J?(p=J,m+=2):(p=e,L===0&&I(se)),p!==e?(E=m,L++,r.substr(m,2).toLowerCase()===hs?(M=r.substr(m,2),m+=2):(M=e,L===0&&I(ts)),M===e&&(r.substr(m,2).toLowerCase()===He?(M=r.substr(m,2),m+=2):(M=e,L===0&&I(ds))),L--,M===e?E=void 0:(m=E,E=e),E!==e?(W=u,p=Ve(),u=p):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,r.substr(m,2)===Re?(p=Re,m+=2):(p=e,L===0&&I(Bs)),p!==e?(E=m,L++,r.substr(m,2).toLowerCase()===hs?(M=r.substr(m,2),m+=2):(M=e,L===0&&I(ts)),M===e&&(r.substr(m,2).toLowerCase()===He?(M=r.substr(m,2),m+=2):(M=e,L===0&&I(ds))),L--,M===e?E=void 0:(m=E,E=e),E!==e?(W=u,p=js(),u=p):(m=u,u=e)):(m=u,u=e)),u}function Ks(){let u,p,E,M;return u=m,r.charCodeAt(m)===47?(p=V,m++):(p=e,L===0&&I(K)),p!==e?(E=At(),E!==e?(M=Fe(),M===e&&(M=null),M!==e?(W=u,p=re(E,M),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u}function qs(){let u,p,E,M,N;return u=m,p=Fe(),p===e&&(p=null),p!==e?(E=Et(),E!==e?(M=Ss(),M!==e?(N=wt(),N===e&&(N=null),N!==e?(W=u,p=Ke(p,E,M,N),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=wt(),p!==e&&(W=u,p=qe(p)),u=p),u}function Et(){let u;return r.substr(m,3).toLowerCase()===v?(u=r.substr(m,3),m+=3):(u=e,L===0&&I(oe)),u===e&&(r.substr(m,3).toLowerCase()===ee?(u=r.substr(m,3),m+=3):(u=e,L===0&&I(O)),u===e&&(r.substr(m,2).toLowerCase()===Ue?(u=r.substr(m,2),m+=2):(u=e,L===0&&I(U)),u===e&&(r.substr(m,2).toLowerCase()===Ie?(u=r.substr(m,2),m+=2):(u=e,L===0&&I(Ye)),u===e&&(r.substr(m,2).toLowerCase()===gt?(u=r.substr(m,2),m+=2):(u=e,L===0&&I(ht)),u===e&&(bs.test(r.charAt(m))?(u=r.charAt(m),m++):(u=e,L===0&&I(be))))))),u}function wt(){let u,p,E,M;return u=m,r.charCodeAt(m)===47?(p=V,m++):(p=e,L===0&&I(K)),p!==e?(E=Fe(),E===e&&(E=null),E!==e?(M=Et(),M!==e?(W=u,p=pe(E,M),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u}function Us(){let u,p,E,M,N;return u=m,p=Fe(),p===e&&(p=null),p!==e?(E=Lt(),E!==e?(M=Ss(),M!==e?(N=Ft(),N===e&&(N=null),N!==e?(W=u,p=dt(p,E,M,N),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u===e&&(u=m,p=Ft(),p!==e&&(W=u,p=Ps(p)),u=p),u}function Lt(){let u;return rs.test(r.charAt(m))?(u=r.charAt(m),m++):(u=e,L===0&&I(ps)),u}function Ft(){let u,p,E,M;return u=m,r.charCodeAt(m)===47?(p=V,m++):(p=e,L===0&&I(K)),p!==e?(E=Fe(),E===e&&(E=null),E!==e?(M=Lt(),M!==e?(W=u,p=pe(E,M),u=p):(m=u,u=e)):(m=u,u=e)):(m=u,u=e),u}function Ss(){let u,p,E,M,N;if(u=m,p=gr(),p!==e){for(E=m,M=[],N=vt();N!==e;)M.push(N),N=vt();M!==e?E=r.substring(E,m):E=M,E!==e?(W=u,p=Me(p,E),u=p):(m=u,u=e)}else m=u,u=e;return u}function gr(){let u,p,E,M;return u=m,r.charCodeAt(m)===109?(p=Q,m++):(p=e,L===0&&I($s)),p!==e?(E=m,L++,r.substr(m,1).toLowerCase()===xs?(M=r.charAt(m),m++):(M=e,L===0&&I(is)),L--,M===e?E=void 0:(m=E,E=e),E!==e?(W=u,p=ys(),u=p):(m=u,u=e)):(m=u,u=e),u===e&&(r.substr(m,3).toLowerCase()===ks?(u=r.substr(m,3),m+=3):(u=e,L===0&&I(Ns)),u===e&&(r.substr(m,3).toLowerCase()===Cs?(u=r.substr(m,3),m+=3):(u=e,L===0&&I(Rs)),u===e&&(r.substr(m,4).toLowerCase()===Is?(u=r.substr(m,4),m+=4):(u=e,L===0&&I(_s)),u===e&&(r.substr(m,4).toLowerCase()===As?(u=r.substr(m,4),m+=4):(u=e,L===0&&I(zs)),u===e&&(r.substr(m,3).toLowerCase()===Os?(u=r.substr(m,3),m+=3):(u=e,L===0&&I(ns)),u===e&&(u=Ws)))))),u}function vt(){let u,p,E,M,N;if(u=m,r.charCodeAt(m)===40?(p=h,m++):(p=e,L===0&&I(S)),p!==e){if(E=m,M=[],_e.test(r.charAt(m))?(N=r.charAt(m),m++):(N=e,L===0&&I(Xe)),N!==e)for(;N!==e;)M.push(N),_e.test(r.charAt(m))?(N=r.charAt(m),m++):(N=e,L===0&&I(Xe));else M=e;M!==e?E=r.substring(E,m):E=M,E!==e?(r.charCodeAt(m)===41?(M=D,m++):(M=e,L===0&&I(A)),M!==e?(W=u,p=Hs(E),u=p):(m=u,u=e)):(m=u,u=e)}else m=u,u=e;if(u===e){if(u=m,p=[],_e.test(r.charAt(m))?(E=r.charAt(m),m++):(E=e,L===0&&I(Xe)),E!==e)for(;E!==e;)p.push(E),_e.test(r.charAt(m))?(E=r.charAt(m),m++):(E=e,L===0&&I(Xe));else p=e;p!==e?u=r.substring(u,m):u=p}return u}if(B=l(),B!==e&&m===r.length)return B;throw B!==e&&m<r.length&&I(lr()),pt(C,d<r.length?r.charAt(d):null,d<r.length?os(d,d+1):os(d,d))}var Rc=Nc,Br=class r{get suffix(){return this._quality!==null||this._extensions!==null?(this._quality||"")+(this._extensions||""):this._suffix}get quality(){return this._quality}get extensions(){return this._extensions}static parse(s,e={}){try{return this.parseOrFail(s,e)}catch{return null}}static parseOrFail(s,e={}){var f;let a=s.trim();try{let l=Rc(a);return new r({...l,notation:(f=e.notation)!=null?f:null})}catch(l){let h=l;throw new Tr(`Failed parsing '${a}': ${h.message}`)}}clone(){return this.set({})}toChordSymbol(s=null){var l,h;if(this.isChordSymbol())return this.clone();let{keyObj:e,referenceIsMinor:a}=this.prepareKeyForConversion(s),f=new r({suffix:this.normalizedSuffix,root:((l=this.root)==null?void 0:l.toChordSymbol(e,a))||null,bass:((h=this.bass)==null?void 0:h.toChordSymbol(e,a))||null,optional:this.optional});return this.finalizeConvertedChord(f,e)}toChordSymbolString(s=null){return this.toChordSymbol(s).toString()}isChordSymbol(){return this.is(Te)}toChordSolfege(s=null){var f,l;if(this.isChordSolfege())return this.clone();let{keyObj:e}=this.prepareKeyForConversion(s),a=new r({suffix:this.normalizedSuffix,root:((f=this.root)==null?void 0:f.toChordSolfege(e))||null,bass:((l=this.bass)==null?void 0:l.toChordSolfege(e))||null,optional:this.optional});return this.finalizeConvertedChord(a,s)}toChordSolfegeString(s=null){return this.toChordSolfege(s).toString()}isChordSolfege(){return this.is(Oe)}toNumeric(s=null){var a,f;if(this.isNumeric())return this.clone();if(this.isNumeral())return this.transform(l=>l.toNumeric());let e=De.wrap(s);return e&&e.isMinor()&&(e=e.relativeMajor),new r({suffix:Pt(this.suffix),root:((a=this.root)==null?void 0:a.toNumeric(e))||null,bass:((f=this.bass)==null?void 0:f.toNumeric(e))||null,...this.optional?{optional:!0}:{}})}toNumeral(s=null){var a;if(this.isNumeral())return this.clone();if(this.isNumeric())return this.transform(f=>f.toNumeral());let e=De.wrap(s);return e&&e.isMinor()&&(e=e.relativeMajor),new r({suffix:Pt(this.suffix),root:e&&this.root?this.root.toNumeral(e):null,bass:((a=this.bass)==null?void 0:a.toNumeral(e))||null,...this.optional?{optional:!0}:{}})}toNumeralString(s=null){return this.toNumeral(s).toString()}isNumeric(){return this.is(ve)}toNumericString(s=null){return this.toNumeric(s).toString()}isNumeral(){return this.is(Be)}toString({useUnicodeModifier:s=!1}={}){let e=this.unicodeSuffix(s),{root:a,suffix:f}=this.renderRoot(e,s),l=a+f;return this.bass&&(l=`${l}/${this.bass.toString({useUnicodeModifier:s})}`),this.optional&&(l=`(${l})`),l}unicodeSuffix(s){let e=this.suffix||"";return s?e.replace(/#(?=\d)/g,"\u266F").replace(/b(?=\d)/g,"\u266D"):e}renderRoot(s,e){if(!this.root)return{root:"",suffix:s};let a=s[0]!=="m",f=this.root.toString({showMinor:a,useUnicodeModifier:e});if(this.root.is(Be)&&this.isMinor()){let l=s.startsWith("m")?s.substring(1):s;return{root:f.toLowerCase(),suffix:l}}return{root:f,suffix:s}}normalize(s=null,{normalizeSuffix:e=!0}={}){let a=e?Pt(this.suffix):this.suffix,f=this.root;return this.root&&(f=this.root.normalize(),s&&(f=f.normalizeEnharmonics(s))),this.set({suffix:a,root:f,bass:this.bass?this.bass.normalize().normalizeEnharmonics(f):null})}useAccidental(s){return this.transform(e=>e.useAccidental(s))}useModifier(s){return Je("useModifier is deprecated, use useAccidental instead"),this.useAccidental(s)}transposeUp(){return this.transform(s=>s.transposeUp())}transposeDown(){return this.transform(s=>s.transposeDown())}transpose(s){return this.transform(e=>e.transpose(s))}constructor(s){var e,a,f,l;this._quality=(e=s.quality)!=null?e:null,this._extensions=(a=s.extensions)!=null?a:null,this._suffix=(f=s.suffix)!=null?f:null,this.optional=(l=s.optional)!=null?l:!1,this.root=r.determineRoot({...s,suffix:this.suffix}),this.bass=r.determineBass(s)}equals(s){return this.suffix===s.suffix&&this.optional===s.optional&&De.equals(this.root,s.root)&&De.equals(this.bass,s.bass)}static determineRoot(s){let{root:e,base:a,accidental:f,suffix:l,chordType:h,notation:S}=s;if(e)return e;if(!a)return null;if(!h)throw new Error("Can't resolve at this point without a chord type");return De.resolve({key:a,keyType:h,minor:wc(a,h,l!=null?l:null),accidental:f!=null?f:null,preferredNotation:S!=null?S:null})}static determineBass(s){let{bass:e,bassBase:a,bassAccidental:f,chordType:l,notation:h}=s;if(e)return e;if(!a)return null;if(!l)throw new Error("Can't resolve at this point without a chord type");return De.resolve({key:a,accidental:f!=null?f:null,minor:!1,keyType:l,preferredNotation:h!=null?h:null})}isMinor(){var s;return((s=this.root)==null?void 0:s.isMinor())||!1}makeMinor(){var s;return this.set({root:((s=this.root)==null?void 0:s.makeMinor())||null})}set(s){var a,f;let e=this.determineSuffixProps(s);return new r({root:((a=this.root)==null?void 0:a.clone())||null,...e,bass:((f=this.bass)==null?void 0:f.clone())||null,...this.optional?{optional:!0}:{},...s})}determineSuffixProps(s){var e,a;return"suffix"in s?{suffix:s.suffix,quality:null,extensions:null}:"quality"in s||"extensions"in s?{quality:(e=s.quality)!=null?e:this._quality,extensions:(a=s.extensions)!=null?a:this._extensions}:this._quality!==null||this._extensions!==null?{quality:this._quality,extensions:this._extensions}:{suffix:this._suffix}}is(s){return(!this.root||this.root.is(s))&&(!this.bass||this.bass.is(s))}transform(s){return this.set({root:this.root?s(this.root):null,bass:this.bass?s(this.bass):null})}get normalizedSuffix(){return this.suffix?Pt(this.suffix):null}prepareKeyForConversion(s){let e=De.wrap(s),a=(e==null?void 0:e.isMinor())||!1;return{keyObj:a?(e==null?void 0:e.relativeMajor)||null:e,referenceIsMinor:a}}finalizeConvertedChord(s,e){var f;let a=s;return(f=this.root)!=null&&f.isMinor()&&(a=a.makeMinor()),a.normalize(e)}},nt=Br;function Lr(r,s,e){return e=e||" ",r.length>s?r:(s-=r.length,e+=e.repeat(s),r+e.slice(0,s))}var st=class r extends Error{static buildMessage(s,e){function a(A){return A.charCodeAt(0).toString(16).toUpperCase()}function f(A){return A.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function l(A){return A.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function h(A){switch(A.type){case"literal":return'"'+f(A.text)+'"';case"class":let x=A.parts.map(F=>Array.isArray(F)?l(F[0])+"-"+l(F[1]):l(F));return"["+(A.inverted?"^":"")+x+"]";case"any":return"any character";case"end":return"end of input";case"other":return A.description}}function S(A){let x=A.map(h),F,P;if(x.sort(),x.length>0){for(F=1,P=1;F<x.length;F++)x[F-1]!==x[F]&&(x[P]=x[F],P++);x.length=P}switch(x.length){case 1:return x[0];case 2:return x[0]+" or "+x[1];default:return x.slice(0,-1).join(", ")+", or "+x[x.length-1]}}function D(A){return A?'"'+f(A)+'"':"end of input"}return"Expected "+S(s)+" but "+D(e)+" found."}constructor(s,e,a,f){super(),this.message=s,this.expected=e,this.found=a,this.location=f,this.name="PeggySyntaxError",typeof Object.setPrototypeOf=="function"?Object.setPrototypeOf(this,r.prototype):this.__proto__=r.prototype,typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,r)}format(s){let e="Error: "+this.message;if(this.location){let a=null,f;for(f=0;f<s.length;f++)if(s[f].grammarSource===this.location.source){a=s[f].text.split(/\r\n|\n|\r/g);break}let l=this.location.start,h=this.location.source+":"+l.line+":"+l.column;if(a){let S=this.location.end,D=Lr("",l.line.toString().length," "),A=a[l.line-1],x=l.line===S.line?S.column:A.length+1;e+=`
 --> `+h+`
`+D+` |
`+l.line+" | "+A+`
`+D+" | "+Lr("",l.column-1," ")+Lr("",x-l.column,"^")}else e+=`
 at `+h}return e}};function Ic(r,s){s=s!==void 0?s:{};let e={},a=s.grammarSource,f={ChordDefinitionValue:is},l=is,h="frets",S=be("frets",!1),D=function(d,C,L,B){return{name:d,baseFret:C||1,frets:L,fingers:B,text:Ye()}},A="/",x=be("/",!1),F=/^[A-Ga-g]/,P=pe([["A","G"],["a","g"]],!1,!1),j=/^[b#\u266D\u266F]/,H=pe(["b","#","\u266D","\u266F"],!1,!1),ne="es",Z=be("es",!1),Y="s",V=be("s",!1),K="is",re=be("is",!1),q=/^[a-zA-Z0-9#\u266Fb\u266D()+\-\/\xF8\u0394\u2212]/,he=pe([["a","z"],["A","Z"],["0","9"],"#","\u266F","b","\u266D","(",")","+","-","/","\xF8","\u0394","\u2212"],!1,!1),ye="base-fret",Ce=be("base-fret",!1),ce=function(d){return d},Pe="fingers",_=be("fingers",!1),ie=function(d){return d},de=function(d){return d},ke=/^[\-A-Za-z]/,Gs=pe(["-",["A","Z"],["a","z"]],!1,!1),Ne=/^[0-9]/,ss=pe([["0","9"]],!1,!1),gs=function(d){return parseInt(d,10)},J=function(d){return d},se="0",hs=be("0",!1),ts=function(){return 0},He="-1",ds=be("-1",!1),Ve=/^[NXnx]/,Re=pe(["N","X","n","x"],!1,!1),Bs=rs("whitespace"),js=rs("optional whitespace"),Ke=/^[ \t\n\r]/,qe=pe([" ","	",`
`,"\r"],!1,!1),v=0,oe=0,ee=[{line:1,column:1}],O=0,Ue=[],U=0,Ie;if(s.startRule!==void 0){if(!(s.startRule in f))throw new Error(`Can't start parsing from rule "`+s.startRule+'".');l=f[s.startRule]}function Ye(){return r.substring(oe,v)}function gt(){return Me(oe,v)}function ht(d,C){throw C=C!==void 0?C:Me(oe,v),xs([rs(d)],r.substring(oe,v),C)}function bs(d,C){throw C=C!==void 0?C:Me(oe,v),$s(d,C)}function be(d,C){return{type:"literal",text:d,ignoreCase:C}}function pe(d,C,L){return{type:"class",parts:d,inverted:C,ignoreCase:L}}function dt(){return{type:"any"}}function Ps(){return{type:"end"}}function rs(d){return{type:"other",description:d}}function ps(d){let C=ee[d],L;if(C)return C;for(L=d-1;!ee[L];)L--;for(C=ee[L],C={line:C.line,column:C.column};L<d;)r.charCodeAt(L)===10?(C.line++,C.column=1):C.column++,L++;return ee[d]=C,C}function Me(d,C){let L=ps(d),B=ps(C);return{source:a,start:{offset:d,line:L.line,column:L.column},end:{offset:C,line:B.line,column:B.column}}}function Q(d){v<O||(v>O&&(O=v,Ue=[]),Ue.push(d))}function $s(d,C){return new st(d,[],"",C)}function xs(d,C,L){return new st(st.buildMessage(d,C),d,C,L)}function is(){let d,C,L,B,le,Ae,$e;if(d=v,C=ys(),C!==e)if(L=W(),L!==e)if(B=Is(),B===e&&(B=null),B!==e)if(r.substr(v,5)===h?(le=h,v+=5):(le=e,U===0&&Q(S)),le!==e){if(Ae=[],$e=ns(),$e!==e)for(;$e!==e;)Ae.push($e),$e=ns();else Ae=e;Ae!==e?($e=_s(),$e===e&&($e=null),$e!==e?(oe=d,C=D(C,B,Ae,$e),d=C):(v=d,d=e)):(v=d,d=e)}else v=d,d=e;else v=d,d=e;else v=d,d=e;else v=d,d=e;return d}function ys(){let d,C,L,B;return d=v,C=v,L=ks(),L!==e?(B=Ns(),B===e&&(B=null),B!==e?(L=[L,B],C=L):(v=C,C=e)):(v=C,C=e),C!==e?d=r.substring(d,v):d=C,d}function ks(){let d,C,L,B;return d=v,C=v,L=Cs(),L!==e?(B=Rs(),B===e&&(B=null),B!==e?(L=[L,B],C=L):(v=C,C=e)):(v=C,C=e),C!==e?d=r.substring(d,v):d=C,d}function Ns(){let d,C,L,B;return d=v,C=v,r.charCodeAt(v)===47?(L=A,v++):(L=e,U===0&&Q(x)),L!==e?(B=Cs(),B!==e?(L=[L,B],C=L):(v=C,C=e)):(v=C,C=e),C!==e?d=r.substring(d,v):d=C,d}function Cs(){let d,C,L,B;return d=v,C=v,F.test(r.charAt(v))?(L=r.charAt(v),v++):(L=e,U===0&&Q(P)),L!==e?(j.test(r.charAt(v))?(B=r.charAt(v),v++):(B=e,U===0&&Q(H)),B===e&&(r.substr(v,2)===ne?(B=ne,v+=2):(B=e,U===0&&Q(Z)),B===e&&(r.charCodeAt(v)===115?(B=Y,v++):(B=e,U===0&&Q(V)),B===e&&(r.substr(v,2)===K?(B=K,v+=2):(B=e,U===0&&Q(re))))),B===e&&(B=null),B!==e?(L=[L,B],C=L):(v=C,C=e)):(v=C,C=e),C!==e?d=r.substring(d,v):d=C,d}function Rs(){let d,C,L;if(d=v,C=[],q.test(r.charAt(v))?(L=r.charAt(v),v++):(L=e,U===0&&Q(he)),L!==e)for(;L!==e;)C.push(L),q.test(r.charAt(v))?(L=r.charAt(v),v++):(L=e,U===0&&Q(he));else C=e;return C!==e?d=r.substring(d,v):d=C,d}function Is(){let d,C,L,B,le;return d=v,r.substr(v,9)===ye?(C=ye,v+=9):(C=e,U===0&&Q(Ce)),C!==e?(L=m(),L!==e?(B=_e(),B!==e?(le=m(),le!==e?(oe=d,C=ce(B),d=C):(v=d,d=e)):(v=d,d=e)):(v=d,d=e)):(v=d,d=e),d}function _s(){let d,C,L,B,le;if(d=v,C=m(),C!==e)if(r.substr(v,7)===Pe?(L=Pe,v+=7):(L=e,U===0&&Q(_)),L!==e){if(B=[],le=As(),le!==e)for(;le!==e;)B.push(le),le=As();else B=e;B!==e?(oe=d,C=ie(B),d=C):(v=d,d=e)}else v=d,d=e;else v=d,d=e;return d}function As(){let d,C,L;return d=v,C=m(),C!==e?(L=zs(),L!==e?(oe=d,C=de(L),d=C):(v=d,d=e)):(v=d,d=e),d}function zs(){let d;return d=Os(),d===e&&(ke.test(r.charAt(v))?(d=r.charAt(v),v++):(d=e,U===0&&Q(Gs))),d}function Os(){let d,C;return d=v,Ne.test(r.charAt(v))?(C=r.charAt(v),v++):(C=e,U===0&&Q(ss)),C!==e&&(oe=d,C=gs(C)),d=C,d}function ns(){let d,C,L;return d=v,C=m(),C!==e?(L=Ws(),L!==e?(oe=d,C=J(L),d=C):(v=d,d=e)):(v=d,d=e),d}function Ws(){let d,C,L;return d=v,C=W(),C!==e?(L=_e(),L===e&&(L=Xe(),L===e&&(L=Hs())),L!==e?(oe=d,C=J(L),d=C):(v=d,d=e)):(v=d,d=e),d}function _e(){let d,C;return d=v,Ne.test(r.charAt(v))?(C=r.charAt(v),v++):(C=e,U===0&&Q(ss)),C!==e&&(oe=d,C=gs(C)),d=C,d}function Xe(){let d,C;return d=v,r.charCodeAt(v)===48?(C=se,v++):(C=e,U===0&&Q(hs)),C!==e&&(oe=d,C=ts()),d=C,d}function Hs(){let d;return r.substr(v,2)===He?(d=He,v+=2):(d=e,U===0&&Q(ds)),d===e&&(Ve.test(r.charAt(v))?(d=r.charAt(v),v++):(d=e,U===0&&Q(Re))),d}function m(){let d,C;if(U++,d=[],C=Le(),C!==e)for(;C!==e;)d.push(C),C=Le();else d=e;return U--,d===e&&(C=e,U===0&&Q(Bs)),d}function W(){let d,C;for(U++,d=[],C=Le();C!==e;)d.push(C),C=Le();return U--,d===e&&(C=e,U===0&&Q(js)),d}function Le(){let d;return Ke.test(r.charAt(v))?(d=r.charAt(v),v++):(d=e,U===0&&Q(qe)),d}if(Ie=l(),Ie!==e&&v===r.length)return Ie;throw Ie!==e&&v<r.length&&Q(Ps()),xs(Ue,O<r.length?r.charAt(O):null,O<r.length?Me(O,O+1):Me(O,O))}var _c=Ic;var jr=class r{constructor(s,e,a,f){this.name=s,this.baseFret=e,this.frets=a,this.fingers=f||[]}static parse(s){let{name:e,baseFret:a,frets:f,fingers:l}=_c(s.trim());return new r(e,a,f,l)}clone(){return new r(this.name,this.baseFret,[...this.frets],[...this.fingers])}},Un=jr,_t=class r{static[Symbol.hasInstance](s){return lt(s,zn)}constructor(s){this.parentLine=null,this.content=s}isRenderable(){return!1}clone(){return new r(this.content)}toString(){return`Comment(content=${this.content})`}};ft(_t.prototype,zn);var tt=_t,Pr=class{constructor(s=null){this.parentLine=null,this.line=null,this.column=null,this.offset=null,s&&(this.line=s.line||null,this.column=s.column||null,this.offset=s.offset||null)}},Yn=Pr,Xn="album",zc="arranger",Zn="artist",Jt="capo",bi="comment",Jn="composer",Qn="copyright",ea="duration",sa="image",Oc="end_of_abc",pi="end_of_bridge",Qt="end_of_chorus",ta="end_of_grid",Wc="end_of_ly",ra="end_of_tab",$i="end_of_verse",zt="end_of_part",Ms="key",kt="_key",ia="lyricist",Hc="sorttitle",na="start_of_abc",er="start_of_bridge",ut="start_of_chorus",xi="start_of_grid",aa="start_of_ly",yi="start_of_tab",oa="start_of_svg",Vc="end_of_svg",ca="start_of_textblock",Kc="end_of_textblock",sr="start_of_verse",at="start_of_part",Ci="subtitle",fa="tempo",la="time",Ai="title",qc="transpose",ua="new_key",ma="year",Ot="chordfont",Wt="chordsize",kr="chordcolour",Ht="textfont",Vt="textsize",Nr="textcolour";var Si="chorus",Uc="chord_style",Cn={[na]:gi,[er]:ot,[ut]:Si,[xi]:li,[aa]:mi,[oa]:hi,[yi]:ui,[ca]:di,[sr]:ct},An={[Oc]:gi,[pi]:ot,[Qt]:Si,[ta]:li,[Wc]:mi,[Vc]:hi,[ra]:ui,[Kc]:di,[$i]:ct},Yc=/^start_of_(.+)$/,Xc=/^end_of_(.+)$/,Rr=class{static interpret(s,e){return new this(s,e).interpret()}constructor(s,e){this.tagName=s,this.tagValue=e}interpret(){return this.startOfPart()||this.endOfPart()||this.sectionStart()||this.sectionEnd()||this.startOfSection()||this.endOfSection()||[null,null]}startOfPart(){return this.tagName===at&&this.tagValue?[Js,this.tagValue.split(" ")[0].toLowerCase()]:null}endOfPart(){return this.tagName===zt?[Qs,In]:null}sectionStart(){return this.tagName in Cn?[Js,Cn[this.tagName]]:null}sectionEnd(){return this.tagName in An?[Qs,An[this.tagName]]:null}startOfSection(){let s=Yc.exec(this.tagName);return s?[Js,s[1]]:null}endOfSection(){let s=Xc.exec(this.tagName);return s?[Qs,s[1]]:null}},Ir=Rr,Zc="cf",Jc="cs",ga="c",Qc="eob",ef="eoc",sf="eog",tf="eot",rf="eov",nf="eop",af="nk",of="sob",cf="soc",ff="sog",lf="sot",uf="sov",mf="sop",gf="st",hf="tf",df="ts",bf="t",pf="p",$f="ep",xf=[bi,sa],_r=[Ai,Ci,Zn,Xn,ma,Jn,ia,Ms,Jt,Uc,fa,la,zc,Qn,ea,Hc],yf=[kt],Cf=[Ot,Wt,kr,Ht,Vt,Nr],Af=[Si,na,er,ut,xi,aa,oa,yi,ca,sr,at],Sn={[Zc]:Ot,[Jc]:Wt,[ga]:bi,[Qc]:pi,[ef]:Qt,[sf]:ta,[tf]:ra,[rf]:$i,[nf]:zt,[$f]:zt,[af]:ua,[of]:er,[cf]:ut,[ff]:xi,[lf]:yi,[uf]:sr,[mf]:at,[pf]:at,[gf]:Ci,[hf]:Ht,[df]:Vt,[bf]:Ai},Sf=/^([^:\s]+)(:?\s*(.+))?$/,En=/^x_(.+)$/;function wn(r){return yf.includes(r)}var Ef=r=>{if(!r)return r;let s=r.trim();return s in Sn?Sn[s]:s},Kt=class r extends Yn{static[Symbol.hasInstance](s){return lt(s,Hn)}constructor(s,e=null,a=null,f={},l=null,h=!1){super(a),this._isMetaTag=!1,this._originalName="",this._name="",this._value="",this.selector=null,this.isNegated=!1,this.attributes={},this.parseNameValue(s,e),this.attributes=f,this.selector=l,this.isNegated=h}parseNameValue(s,e){s==="meta"?this.parseMetaTag(e):(this.name=s,this.value=e||"")}parseMetaTag(s){if(!s)throw new Error("Expected value");let[e,a]=s.split(/\s(.+)/);this.name=e,this.value=a||"",this._isMetaTag=!0}static parse(s){return s instanceof r?s:this.parseWithRegex(s,Sf)}static parseWithRegex(s,e){let a=s.match(e);return a!==null?new r(a[1],a[3]||null):null}static parseOrFail(s){let e=this.parse(s);if(!e)throw new Error(`Failed to parse ${s}`);return e}get label(){let s=this.attributes.label;return s&&s.length>0?s:this.value||""}isSectionDelimiter(){return this.isSectionStart()||this.isSectionEnd()}isSectionStart(){let[s]=Ir.interpret(this.name,this.value);return s===Js}isSectionEnd(){let[s]=Ir.interpret(this.name,this.value);return s===Qs}isInlineFontTag(){return Cf.includes(this.name)}isComment(){return this.name===bi||this.name===ga}isImage(){return this.name===sa}set name(s){this._name=Ef(s),this._originalName=s}get name(){return this._name.trim()}get originalName(){return this._originalName.trim()}set value(s){this._value=s||""}get value(){return`${this._value}`.trim()}hasValue(){return this.value.length>0}hasAttributes(){return Object.keys(this.attributes).length>0}hasLabel(){return this.label.length>0}isRenderable(){return xf.includes(this.name)||this.hasRenderableLabel()}hasRenderableLabel(){return(Af.includes(this.name)||this.isSectionStart())&&this.hasLabel()}isMetaTag(){return this._isMetaTag||En.test(this.name)||_r.indexOf(this.name)!==-1}isStandardOrCustomMetaTag(){return _r.indexOf(this.name)!==-1||En.test(this.name)}clone(){return new r(this._originalName,this.value,null,this.attributes)}toString(){return`Tag(name=${this.name}, value=${this.value})`}set({value:s}){return new r(this._originalName,s,null,this.attributes)}setAttribute(s,e){return new r(this._originalName,this.value,null,{...this.attributes,[s]:e})}};ft(Kt.prototype,Hn);var fe=Kt;var _l={separator:",",order:[..._r,{match:/^x_/,sortMethod:"alphabetical"}]};var zr=class extends Yn{},Ei=zr,qt=class r extends Ei{static[Symbol.hasInstance](s){return lt(s,On)}constructor(s){super(),this.string=s}evaluate(){return this.string}isRenderable(){return!0}clone(){return new r(this.string)}};ft(qt.prototype,On);var us=qt,Ut=class r{static[Symbol.hasInstance](s){return lt(s,Wn)}constructor(s=" "){this.content=s}clone(){return new r}};ft(Ut.prototype,Wn);var Ln=Ut,Or=class r extends Ei{constructor(s,e=null){super(),this.expressions=[],this.expressions=s,this.variable=e}evaluate(s,e){return this.expressions.map(a=>a.evaluate(s,e,this.variable)).join("")}isRenderable(){return!0}clone(){return new r(this.expressions.map(s=>s.clone()),this.variable)}},Fn=Or,Wr=class extends Error{constructor(s,e=null,a=null,f=null){super(`${s} on line ${e} column ${a}`),this.line=null,this.column=null,this.offset=null,this.name="ExpressionError",this.line=e,this.column=a,this.offset=f}},wf=Wr,Hr=class r extends Ei{constructor({variable:s=null,valueTest:e=null,trueExpression:a=[],falseExpression:f=[],line:l=null,column:h=null,offset:S=null}){super({line:l,column:h,offset:S}),this.trueExpression=[],this.falseExpression=[],this.variable=s||null,this.valueTest=e||null,this.trueExpression=a,this.falseExpression=f}evaluate(s,e,a=null){if(this.variable)return this.evaluateWithVariable(s,e);if(!a)throw new wf("Unexpected empty expression",this.line,this.column,this.offset);return this.evaluateToString(s.get(a)||"",e)}evaluateToString(s,e){return Array.isArray(s)?s.join(e):s}evaluateWithVariable(s,e){if(!this.variable)throw new Error("Expected this.variable to be present");let a=s.get(this.variable);return a&&(Ec(this.valueTest)||a===this.valueTest)?this.evaluateForTruthyValue(s,e,a):this.falseExpression.length?new Fn(this.falseExpression,this.variable).evaluate(s,e):""}evaluateForTruthyValue(s,e,a){return this.trueExpression.length?new Fn(this.trueExpression,this.variable).evaluate(s,e):this.evaluateToString(a,e)}isRenderable(){return!0}clone(){return new r({variable:this.variable,valueTest:this.valueTest,trueExpression:this.trueExpression.map(s=>s.clone()),falseExpression:this.falseExpression.map(s=>s.clone()),line:this.line,column:this.column,offset:this.offset})}},vn=Hr;var ha={};ha=JSON.parse('{"A":"A base-fret 0 frets x 0 2 2 2 0","A/B":"A/B base-fret 0 frets x 2 2 2 2 0","A/C#":"A/C# base-fret 0 frets x 4 2 2 2 0","A/D":"A/D base-fret 0 frets x x 0 2 2 0","A/E":"A/E base-fret 0 frets 0 0 2 2 2 0","A/F#":"A/F# base-fret 0 frets 2 0 2 2 0 0","A/G":"A/G base-fret 0 frets 3 0 2 2 0 0","A/G#":"A/G# base-fret 0 frets 4 x 2 2 0 0","A11":"A11 base-fret 2 frets 4 3 x 1 2 2","A13":"A13 base-fret 0 frets x 0 2 0 2 2","A13(b9)":"A13(b9) base-fret 3 frets 2 x 2 3 4 3","A2":"A2 base-fret 0 frets x 0 2 2 0 0","A2/C#":"A2/C# base-fret 0 frets x 4 2 2 0 0","A2/E":"A2/E base-fret 0 frets 0 0 2 2 0 0","A2/F#":"A2/F# base-fret 0 frets 2 0 2 2 0 0","A2/G#":"A2/G# base-fret 0 frets 4 x 2 2 0 0","Asus":"Asus base-fret 0 frets x 0 2 2 3 0","Asus/E":"Asus/E base-fret 0 frets 0 0 2 2 3 0","A5":"A5 base-fret 0 frets x 0 2 2 x x","A5/E":"A5/E base-fret 2 frets 0 0 1 1 1 4","A6":"A6 base-fret 0 frets x 0 2 2 2 2","A7":"A7 base-fret 0 frets x 0 2 0 2 0","Aaug7":"Aaug7 base-fret 0 frets x 0 3 2 2 1","A7(#5b9)":"A7(#5b9) base-fret 3 frets 2 x 2 3 3 3","A7(b5)":"A7(b5) base-fret 0 frets x 0 1 0 2 x","A7/E":"A7/E base-fret 0 frets 0 0 2 0 2 0","A7/G":"A7/G base-fret 0 frets 3 x 2 0 2 0","A7(b9)":"A7(b9) base-fret 0 frets x 0 2 3 2 3","A7sus4":"A7sus4 base-fret 0 frets x 0 2 0 3 0","A7sus4/E":"A7sus4/E base-fret 0 frets 0 0 2 0 3 0","A9":"A9 base-fret 0 frets x 0 2 4 0 0","A9(b5)":"A9(b5) base-fret 0 frets x 0 1 4 2 3","Aaug":"Aaug base-fret 0 frets x 0 3 2 2 1","G#9":"G#9 base-fret 0 frets 4 3 4 3 4 x","G#sus":"G#sus base-fret 0 frets 4 4 1 1 2 x","G#ma9":"G#ma9 base-fret 0 frets 4 x 1 3 1 3","Adim":"Adim base-fret 0 frets x 0 1 2 1 2","Adim7":"Adim7 base-fret 0 frets x 0 1 2 1 2","Am":"Am base-fret 0 frets x 0 2 2 1 0","Am/C":"Am/C base-fret 0 frets x 3 2 2 1 0","Am13":"Am13 base-fret 0 frets x 0 0 0 1 2","Am6":"Am6 base-fret 0 frets x 0 2 2 1 2","Am7":"Am7 base-fret 0 frets x 0 2 0 1 0","Am7(b5)":"Am7(b5) base-fret 0 frets x 0 1 0 1 x","Am7/G":"Am7/G base-fret 0 frets 3 x 2 0 1 0","Am9":"Am9 base-fret 0 frets x 0 2 4 1 0","Ama7":"Ama7 base-fret 0 frets x 0 2 1 2 0","Ama9":"Ama9 base-fret 0 frets x 0 2 4 2 4","B":"B base-fret 0 frets x 2 4 4 4 2","B/A":"B/A base-fret 0 frets x 0 4 4 4 2","B/A#":"B/A# base-fret 0 frets x 1 4 3 0 x","B/C#":"B/C# base-fret 0 frets x 4 4 4 4 x","B/D#":"B/D# base-fret 0 frets x x 1 4 4 2","B/E":"B/E base-fret 0 frets 0 2 4 4 0 0","B/F#":"B/F# base-fret 0 frets 2 2 4 4 4 2","B/G#":"B/G# base-fret 0 frets 4 x 4 4 4 x","B11":"B11 base-fret 0 frets x 2 1 2 0 0","B13":"B13 base-fret 0 frets x 2 4 2 4 4","B13(b9)":"B13(b9) base-fret 5 frets 2 x 2 3 4 3","B2":"B2 base-fret 0 frets x 2 4 4 2 2","B2/A#":"B2/A# base-fret 0 frets x 1 4 4 0 x","B2/D#":"B2/D# base-fret 0 frets x 3 1 1 0 x","B2/G#":"B2/G# base-fret 0 frets 4 x 4 4 0 x","Bsus":"Bsus base-fret 0 frets x 2 4 4 0 0","Bsus/F#":"Bsus/F# base-fret 0 frets 2 2 4 4 0 0","B5":"B5 base-fret 0 frets x 2 4 4 0 x","B5/F#":"B5/F# base-fret 0 frets 2 2 4 4 2 2","B6":"B6 base-fret 0 frets x 2 4 4 4 4","B6/9":"B6/9 base-fret 0 frets x 2 1 1 2 x","B7":"B7 base-fret 0 frets x 2 1 2 0 2","Baug7":"Baug7 base-fret 0 frets x 2 1 0 0 3","B7(#5b9)":"B7(#5b9) base-fret 5 frets 2 x 2 3 3 3","B7(#9)":"B7(#9) base-fret 0 frets x 2 1 2 3 x","B7(b5)":"B7(b5) base-fret 0 frets x 2 3 2 4 x","B7(b9)":"B7(b9) base-fret 0 frets x 2 1 2 1 x","B7/A":"B7/A base-fret 0 frets x 0 1 2 0 2","B7/D#":"B7/D# base-fret 0 frets x x 1 2 0 2","B7/F#":"B7/F# base-fret 0 frets 2 2 4 2 4 2","B7sus4":"B7sus4 base-fret 0 frets x 2 2 2 0 2","B7sus4/F#":"B7sus4/F# base-fret 0 frets 2 2 4 4 0 0","B7sus4/G#":"B7sus4/G# base-fret 0 frets 4 x 4 4 0 0","B9":"B9 base-fret 0 frets x 2 1 2 2 2","B9(b5)":"B9(b5) base-fret 0 frets x 2 1 2 2 1","Baug":"Baug base-fret 0 frets x 2 1 0 0 3","A#/D":"A#/D base-fret 0 frets x x 0 3 3 1","A#/F":"A#/F base-fret 0 frets 1 1 3 3 3 1","A#11":"A#11 base-fret 0 frets x 1 0 3 4 4","A#13":"A#13 base-fret 0 frets x 1 3 1 3 3","A#2":"A#2 base-fret 0 frets x 1 3 3 1 1","A#2/F":"A#2/F base-fret 0 frets 1 1 3 3 1 1","A#sus":"A#sus base-fret 0 frets x 1 3 3 4 1","A#7":"A#7 base-fret 0 frets x 1 3 1 3 1","A#aug7":"A#aug7 base-fret 0 frets x 1 4 1 3 x","A#7(#5b9)":"A#7(#5b9) base-fret 5 frets 1 x 1 2 2 2","A#7(#9)":"A#7(#9) base-fret 0 frets x 1 0 1 2 x","A#7(b5)":"A#7(b5) base-fret 0 frets 2 x 2 3 1 x","A#7/F":"A#7/F base-fret 0 frets 1 1 3 1 3 1","A#9":"A#9 base-fret 0 frets x 1 3 3 1 1","A#9(b5)":"A#9(b5) base-fret 0 frets x 1 0 1 1 0","A#m11":"A#m11 base-fret 0 frets 4 x 4 4 2 x","A#m13":"A#m13 base-fret 0 frets x 1 1 1 2 3","A#m6":"A#m6 base-fret 0 frets x x x 3 2 3","A#m7":"A#m7 base-fret 0 frets x 1 3 1 2 1","A#m7(b5)":"A#m7(b5) base-fret 0 frets x 1 2 1 2 0","A#m9":"A#m9 base-fret 0 frets x 4 3 1 1 1","A#ma9":"A#ma9 base-fret 0 frets x 1 0 2 1 x","Bdim":"Bdim base-fret 0 frets x 2 0 1 0 1","Bdim7":"Bdim7 base-fret 0 frets x 2 0 1 0 1","Bm":"Bm base-fret 0 frets x 2 4 4 3 2","Bm/D":"Bm/D base-fret 0 frets x x 0 4 3 2","Bm11":"Bm11 base-fret 0 frets x 2 0 2 2 0","Bm13":"Bm13 base-fret 0 frets x 2 0 1 2 2","Bm6":"Bm6 base-fret 0 frets x 2 0 1 0 2","Bm7":"Bm7 base-fret 0 frets x 2 4 2 3 2","Bm7(b5)":"Bm7(b5) base-fret 0 frets x 2 3 2 3 x","Bm7/A":"Bm7/A base-fret 0 frets x 0 4 2 3 2","Bm9":"Bm9 base-fret 0 frets x 2 x 2 2 2","Bma7":"Bma7 base-fret 0 frets 2 2 4 3 4 2","Bma9":"Bma9 base-fret 0 frets x 2 1 3 2 x","C":"C base-fret 0 frets x 3 2 0 3 3","C#/G#":"C#/G# base-fret 0 frets x x x 1 2 1","C#11":"C#11 base-fret 0 frets x 4 3 4 2 2","C#13":"C#13 base-fret 2 frets x 2 1 2 2 4","C#2":"C#2 base-fret 0 frets x 4 1 1 2 x","C#2/G#":"C#2/G# base-fret 3 frets 1 1 3 3 1 1","C#7":"C#7 base-fret 0 frets x 4 3 4 2 x","C#aug7":"C#aug7 base-fret 0 frets x 4 3 2 0 x","C#7(b5)":"C#7(b5) base-fret 0 frets x 4 3 4 x 3","C#7(b9)":"C#7(b9) base-fret 0 frets x 4 3 4 3 x","C#7/G#":"C#7/G# base-fret 3 frets 1 1 3 1 3 1","C#9":"C#9 base-fret 0 frets x 4 3 4 4 4","C#m7":"C#m7 base-fret 0 frets x 4 2 4 2 4","C#m7(b5)":"C#m7(b5) base-fret 0 frets x 4 2 4 2 3","C#m9":"C#m9 base-fret 0 frets x 4 2 4 4 4","C/A":"C/A base-fret 0 frets x 0 2 0 1 0","C/B":"C/B base-fret 0 frets x 2 x 0 1 3","C/A#":"C/A# base-fret 0 frets x 1 2 0 2 0","C/D":"C/D base-fret 0 frets x x 0 0 1 0","C/E":"C/E base-fret 0 frets 0 3 2 0 1 0","C/F":"C/F base-fret 0 frets x x 3 0 1 0","C/G":"C/G base-fret 0 frets 3 3 2 0 1 0","C11":"C11 base-fret 0 frets x 3 3 3 3 3","C2":"C2 base-fret 0 frets x 3 2 0 3 3","C2/A":"C2/A base-fret 0 frets x 0 2 0 3 3","C2/B":"C2/B base-fret 0 frets x 2 2 0 3 3","C2/E":"C2/E base-fret 0 frets 0 3 2 0 3 3","C2/G":"C2/G base-fret 0 frets 3 3 2 0 3 3","Csus":"Csus base-fret 0 frets x 3 3 2 1 1","C5":"C5 base-fret 0 frets x 3 x 0 1 3","C5/B":"C5/B base-fret 0 frets x 2 x 0 1 3","C5/G":"C5/G base-fret 0 frets 3 3 x 0 1 3","C6":"C6 base-fret 0 frets x 3 2 2 1 0","C7":"C7 base-fret 0 frets 0 3 2 3 1 0","Caug7":"Caug7 base-fret 0 frets x 3 2 1 1 0","C7(b9)":"C7(b9) base-fret 0 frets x 3 2 3 2 x","C7/E":"C7/E base-fret 0 frets 0 3 2 3 1 0","C7/G":"C7/G base-fret 0 frets 3 x 2 3 1 0","C7sus4":"C7sus4 base-fret 0 frets x 3 3 3 1 3","C9":"C9 base-fret 0 frets x 3 2 0 3 0","Caug":"Caug base-fret 0 frets x 3 2 1 1 0","Cdim":"Cdim base-fret 0 frets x x 1 2 1 2","Cdim7":"Cdim7 base-fret 0 frets x 3 4 2 4 x","Cm":"Cm base-fret 0 frets x 3 1 x 1 3","Cm/D#":"Cm/D# base-fret 0 frets x x 1 x 1 3","Cm11":"Cm11 base-fret 0 frets x 3 3 3 4 3","Cm7":"Cm7 base-fret 0 frets x 3 1 3 4 x","Cm9":"Cm9 base-fret 0 frets x 3 1 3 3 3","Cma7":"Cma7 base-fret 0 frets x 3 2 0 0 0","Cma9":"Cma9 base-fret 0 frets x 3 2 4 3 x","D":"D base-fret 0 frets x x 0 2 3 2","D/A":"D/A base-fret 0 frets x 0 0 2 3 2","D/B":"D/B base-fret 0 frets x 2 0 2 3 2","D/C":"D/C base-fret 0 frets x 3 x 2 3 2","D/C#":"D/C# base-fret 0 frets x 4 x 2 3 2","D/E":"D/E base-fret 0 frets x x 2 2 3 2","D/F#":"D/F# base-fret 0 frets 2 0 0 2 3 2","D/G":"D/G base-fret 0 frets 3 x 0 0 3 2","D11":"D11 base-fret 3 frets x 2 2 2 2 2","D13":"D13 base-fret 0 frets x x 0 2 0 2","D2":"D2 base-fret 0 frets x x 0 2 2 0","D2/A":"D2/A base-fret 0 frets x 0 0 2 3 0","D2/B":"D2/B base-fret 0 frets x 2 0 2 3 0","D2/C#":"D2/C# base-fret 0 frets x 4 0 2 3 0","D2/F#":"D2/F# base-fret 0 frets 2 x 0 2 3 0","Dsus":"Dsus base-fret 0 frets x x 0 2 3 3","Dsus/A":"Dsus/A base-fret 0 frets x 0 0 2 3 3","D5":"D5 base-fret 0 frets x x 0 2 3 x","D5/A":"D5/A base-fret 2 frets x 0 0 1 2 4","D5/C#":"D5/C# base-fret 2 frets x x 0 1 1 4","D6":"D6 base-fret 0 frets x x 0 2 0 2","D7":"D7 base-fret 0 frets x x 0 2 1 2","Daug7":"Daug7 base-fret 0 frets x x 0 3 3 2","D7(#9)":"D7(#9) base-fret 3 frets x 2 1 2 3 x","D7(b5)":"D7(b5) base-fret 0 frets x x 0 1 1 2","D7(b9)":"D7(b9) base-fret 2 frets x 4 x 4 3 1","D7/A":"D7/A base-fret 0 frets x 0 0 2 1 2","D7/C":"D7/C base-fret 0 frets x 3 0 2 1 2","D7/F#":"D7/F# base-fret 0 frets 2 0 0 2 1 2","D7sus4":"D7sus4 base-fret 0 frets x x 0 2 1 1","D9":"D9 base-fret 0 frets x x 0 2 2 0","Daug":"Daug base-fret 0 frets x x 0 3 3 2","Ddim":"Ddim base-fret 0 frets x x 0 1 0 1","Ddim7":"Ddim7 base-fret 0 frets x x 0 1 0 1","Dm":"Dm base-fret 0 frets x x 0 2 1 3","Dm/F":"Dm/F base-fret 0 frets x x 3 2 1 3","Dm7":"Dm7 base-fret 0 frets x x 0 2 1 1","Dm7(b5)":"Dm7(b5) base-fret 0 frets x x 0 1 1 1","Dm7/C":"Dm7/C base-fret 0 frets x 3 x 2 1 1","Dma7":"Dma7 base-fret 0 frets x x 0 2 2 2","Dma9":"Dma9 base-fret 2 frets x 4 3 1 1 0","E":"E base-fret 0 frets 0 2 2 1 0 0","E/A":"E/A base-fret 0 frets x 0 2 1 0 0","E/B":"E/B base-fret 0 frets x 2 2 1 0 0","E/C#":"E/C# base-fret 0 frets x 4 2 4 0 0","E/D":"E/D base-fret 0 frets x x 0 1 0 0","E/D#":"E/D# base-fret 0 frets x x 1 1 0 0","E/F#":"E/F# base-fret 0 frets 2 2 2 1 0 x","E/G#":"E/G# base-fret 0 frets 4 x 2 4 0 0","E11":"E11 base-fret 0 frets 0 2 0 2 3 4","E13":"E13 base-fret 0 frets 0 2 0 1 3 0","E2":"E2 base-fret 0 frets 0 2 4 1 0 0","E2/B":"E2/B base-fret 0 frets x 2 4 1 0 0","E2/C#":"E2/C# base-fret 5 frets x 2 4 4 0 0","E2/D#":"E2/D# base-fret 5 frets x 2 4 3 0 0","E2/G#":"E2/G# base-fret 0 frets 4 x 4 4 0 0","Esus":"Esus base-fret 0 frets 0 2 2 2 0 0","Esus/B":"Esus/B base-fret 0 frets x 2 2 2 0 0","E5":"E5 base-fret 0 frets 0 2 4 4 0 0","E5/B":"E5/B base-fret 0 frets x 2 2 4 0 0","E5/D#":"E5/D# base-fret 5 frets x 1 4 3 0 0","E6":"E6 base-fret 0 frets 0 2 2 1 2 0","E7":"E7 base-fret 0 frets 0 2 0 1 0 0","E7(#9)":"E7(#9) base-fret 0 frets 0 2 0 1 3 3","E7(b5)":"E7(b5) base-fret 0 frets 0 1 2 1 3 x","E7(b9)":"E7(b9) base-fret 0 frets 0 x 0 1 0 1","E7/B":"E7/B base-fret 0 frets x 2 0 1 0 0","E7/D":"E7/D base-fret 0 frets x x 0 1 0 0","E7/G#":"E7/G# base-fret 0 frets 4 x 0 4 0 0","E7sus4":"E7sus4 base-fret 0 frets 0 2 0 2 0 0","E9":"E9 base-fret 0 frets 0 2 4 1 0 0","Eaug":"Eaug base-fret 0 frets 0 3 2 1 1 0","Eaug7":"Eaug7 base-fret 0 frets 0 3 2 1 1 0","D#/A#":"D#/A# base-fret 0 frets x x x 3 4 3","D#11":"D#11 base-fret 0 frets x x 1 0 2 4","D#13":"D#13 base-fret 4 frets x 2 1 2 2 4","D#2":"D#2 base-fret 0 frets x x 1 3 4 1","D#2/A#":"D#2/A# base-fret 5 frets 1 1 3 3 1 1","D#7":"D#7 base-fret 0 frets x x 1 3 2 3","D#aug7":"D#aug7 base-fret 0 frets x x 1 4 2 3","D#7(#9)":"D#7(#9) base-fret 0 frets x x 1 0 2 2","D#7(b5)":"D#7(b5) base-fret 0 frets x x 1 2 2 3","D#7(b9)":"D#7(b9) base-fret 0 frets x x 1 0 2 0","D#7/A#":"D#7/A# base-fret 5 frets 2 2 4 2 4 2","D#9":"D#9 base-fret 0 frets x x 1 0 2 1","D#dim7":"D#dim7 base-fret 0 frets x x 1 2 1 2","D#m9":"D#m9 base-fret 3 frets x 3 1 3 3 3","D#ma9":"D#ma9 base-fret 0 frets x x 1 0 3 1","Edim":"Edim base-fret 0 frets 0 1 2 0 2 0","Edim7":"Edim7 base-fret 0 frets 0 1 2 0 2 0","Em":"Em base-fret 0 frets 0 2 2 0 0 0","Em/G":"Em/G base-fret 0 frets 3 2 2 0 3 3","Em7":"Em7 base-fret 0 frets 0 2 2 0 3 0","Em7/D":"Em7/D base-fret 0 frets x x 0 0 3 3","Em9":"Em9 base-fret 0 frets 0 2 4 0 0 0","Ema7":"Ema7 base-fret 0 frets 0 2 1 1 0 0","Ema9":"Ema9 base-fret 0 frets 0 2 4 4 4 4","F":"F base-fret 0 frets x x 3 2 1 1","F#/C#":"F#/C# base-fret 0 frets x 4 4 3 2 2","F#13":"F#13 base-fret 0 frets 2 4 2 3 4 2","F#sus":"F#sus base-fret 0 frets 2 4 4 4 2 2","F#6":"F#6 base-fret 0 frets 2 x 1 3 2 x","F#7":"F#7 base-fret 0 frets 1 4 1 3 1 1","F#7(b5)":"F#7(b5) base-fret 0 frets 2 x 2 3 1 x","F#7/C#":"F#7/C# base-fret 0 frets x 4 2 3 2 2","F#dim7":"F#dim7 base-fret 0 frets 2 3 4 2 4 2","F#m/A":"F#m/A base-fret 0 frets x 0 2 2 0 0","F#m6":"F#m6 base-fret 0 frets 2 x 1 2 2 2","F#m7":"F#m7 base-fret 0 frets 2 x 2 2 0 0","F#m7(b5)":"F#m7(b5) base-fret 0 frets 2 x 2 2 1 0","F#m7/E":"F#m7/E base-fret 0 frets 0 4 4 2 0 0","F#ma9":"F#ma9 base-fret 0 frets 2 1 3 1 2 1","F/A":"F/A base-fret 0 frets x 0 3 2 1 1","F/A#":"F/A# base-fret 0 frets x 1 3 2 1 1","F/C":"F/C base-fret 0 frets x 3 3 2 1 1","F/D":"F/D base-fret 0 frets x x 0 2 1 1","F/E":"F/E base-fret 0 frets x x 2 2 1 1","F/D#":"F/D# base-fret 0 frets x x 1 2 1 1","F/G":"F/G base-fret 0 frets 3 x 3 2 1 1","F13":"F13 base-fret 0 frets 1 3 1 2 3 1","F2":"F2 base-fret 0 frets x x 3 0 1 1","F2/A":"F2/A base-fret 0 frets x 0 3 0 1 1","F2/C":"F2/C base-fret 0 frets x 3 3 0 1 1","F2/D":"F2/D base-fret 0 frets x x 0 0 1 1","F2/E":"F2/E base-fret 0 frets x x 2 0 1 1","Fsus":"Fsus base-fret 0 frets x x 3 3 1 1","F5":"F5 base-fret 0 frets 1 3 3 x 1 1","F6":"F6 base-fret 0 frets x x 3 2 3 1","F7":"F7 base-fret 0 frets 1 3 1 2 1 1","F7(#9)":"F7(#9) base-fret 0 frets x x 3 2 4 4","F7(b9)":"F7(b9) base-fret 0 frets x x 3 2 4 2","F7/A":"F7/A base-fret 0 frets x 0 1 2 1 1","F7/C":"F7/C base-fret 0 frets x 3 1 2 1 1","F7sus4":"F7sus4 base-fret 0 frets 1 3 1 3 1 1","F9":"F9 base-fret 0 frets x x 3 0 1 1","Faug":"Faug base-fret 0 frets x x 3 2 2 1","Faug7":"Faug7 base-fret 0 frets x x 3 2 2 1","Fdim":"Fdim base-fret 0 frets x x 0 1 0 1","Fdim7":"Fdim7 base-fret 0 frets x x 3 4 3 4","Fm":"Fm base-fret 0 frets x x 3 1 1 1","Fm6":"Fm6 base-fret 0 frets 1 x 0 1 1 1","Fm7":"Fm7 base-fret 0 frets 1 3 1 1 1 1","Fm7(b5)":"Fm7(b5) base-fret 0 frets 1 x 1 1 0 x","Fm9":"Fm9 base-fret 0 frets 1 3 1 1 1 3","Fma7":"Fma7 base-fret 0 frets x x 3 2 1 0","G":"G base-fret 0 frets 3 2 0 0 3 3","G#/D#":"G#/D# base-fret 0 frets x x 1 1 1 4","G#11":"G#11 base-fret 0 frets 4 x 4 3 2 x","G#13":"G#13 base-fret 0 frets 4 x 4 3 1 1","G#13(b9)":"G#13(b9) base-fret 3 frets 1 x 1 2 3 2","G#7":"G#7 base-fret 0 frets 4 3 4 1 1 x","G#aug7":"G#aug7 base-fret 0 frets 4 x 3 4 4 4","G#7(#5b9)":"G#7(#5b9) base-fret 3 frets 1 x 1 2 2 2","G#7(#9)":"G#7(#9) base-fret 0 frets 4 x 4 2 4 x","G#7(b5)":"G#7(b5) base-fret 0 frets 4 3 4 x 3 4","G#7/D#":"G#7/D# base-fret 3 frets x 3 1 2 1 1","G#9(b5)":"G#9(b5) base-fret 0 frets 4 x 4 3 3 x","G#m11":"G#m11 base-fret 0 frets 4 x 4 4 2 x","G#m13":"G#m13 base-fret 0 frets 4 2 4 x x 1","G#m6":"G#m6 base-fret 0 frets 4 3 4 3 4 4","G#m7":"G#m7 base-fret 0 frets 4 2 4 4 x 2","G#m7(b5)":"G#m7(b5) base-fret 0 frets 4 x 4 4 3 x","G#m7(b9)":"G#m7(b9) base-fret 2 frets 2 x 1 2 2 4","G#m9":"G#m9 base-fret 0 frets 4 2 4 3 x 2","G/A":"G/A base-fret 0 frets x 0 0 0 3 3","G/B":"G/B base-fret 0 frets x 2 0 0 3 3","G/C":"G/C base-fret 0 frets x 3 0 0 3 3","G/D":"G/D base-fret 0 frets x x 0 0 3 3","G/E":"G/E base-fret 0 frets 0 2 0 0 3 3","G/F":"G/F base-fret 0 frets 1 2 0 0 3 3","G/F#":"G/F# base-fret 0 frets 2 2 0 0 3 3","G11":"G11 base-fret 0 frets 3 x 3 2 1 x","G13":"G13 base-fret 0 frets 3 2 3 0 0 0","G13(b9)":"G13(b9) base-fret 3 frets 1 x 1 2 3 2","G2":"G2 base-fret 0 frets 3 x 0 2 3 3","G2/B":"G2/B base-fret 0 frets x 2 0 2 3 3","G2/D":"G2/D base-fret 0 frets x x 0 2 3 3","G2/E":"G2/E base-fret 0 frets x x 2 2 3 3","G2/F#":"G2/F# base-fret 0 frets 2 x 0 2 3 3","Gsus":"Gsus base-fret 0 frets 3 x 0 0 1 3","Gsus/D":"Gsus/D base-fret 0 frets x x 0 0 1 3","G5":"G5 base-fret 0 frets 3 x 0 0 3 3","G5/D":"G5/D base-fret 0 frets x x 0 0 3 3","G5/F#":"G5/F# base-fret 0 frets 2 x 0 0 3 3","G6":"G6 base-fret 0 frets 3 2 0 0 0 0","G7":"G7 base-fret 0 frets 3 2 3 0 0 3","Gaug7":"Gaug7 base-fret 0 frets 3 x 3 4 2 x","G7(#5b9)":"G7(#5b9) base-fret 0 frets 3 x 3 4 4 4","G7(#9)":"G7(#9) base-fret 0 frets 3 2 3 3 3 x","G7(b5)":"G7(b5) base-fret 0 frets 3 x 3 4 4 x","G7(b9)":"G7(b9) base-fret 0 frets 3 x 3 1 3 x","G7/B":"G7/B base-fret 0 frets x 2 3 0 3 3","G7/D":"G7/D base-fret 0 frets x x 0 0 0 1","G7sus4":"G7sus4 base-fret 0 frets 3 x 0 0 1 1","G9":"G9 base-fret 0 frets 3 x 0 2 3 3","G9(b5)":"G9(b5) base-fret 0 frets 3 x 3 2 2 x","Gaug":"Gaug base-fret 0 frets 3 2 1 0 0 3","F#9":"F#9 base-fret 0 frets 2 4 2 3 2 4","Gdim":"Gdim base-fret 0 frets x 1 2 0 2 0","Gdim7":"Gdim7 base-fret 0 frets x 1 2 0 2 0","Gm11":"Gm11 base-fret 0 frets 3 x 3 3 1 x","Gm6":"Gm6 base-fret 0 frets 3 x 2 3 3 3","Gm7(b5)":"Gm7(b5) base-fret 0 frets 3 x 3 3 2 x","Gma7":"Gma7 base-fret 0 frets 3 x 3 0 0 2","Gma9":"Gma9 base-fret 0 frets 3 x 4 2 3 x","A9(#5)":"A9(#5) base-fret 0 frets x 0 3 4 2 3","A9sus4":"A9sus4 base-fret 0 frets x 0 0 0 0 0","G#":"G# base-fret 0 frets 4 3 1 1 1 x","G#(2)":"G#(2) base-fret 0 frets 4 1 1 3 1 4","G#6":"G#6 base-fret 0 frets 4 3 1 1 1 1","G#6/9":"G#6/9 base-fret 0 frets 4 3 3 3 4 x","G#7(b9)":"G#7(b9) base-fret 0 frets x x 1 2 1 2","G#7sus4":"G#7sus4 base-fret 0 frets x x 1 1 2 2","G#9(#5)":"G#9(#5) base-fret 0 frets 4 3 2 3 x 2","G#9sus4":"G#9sus4 base-fret 0 frets 4 x 4 3 2 2","G#dim7":"G#dim7 base-fret 0 frets x x 0 1 0 1","G#m":"G#m base-fret 0 frets 4 2 1 1 4 x","G#m(ma7)":"G#m(ma7) base-fret 0 frets 4 2 1 1 x 3","G#ma7":"G#ma7 base-fret 0 frets 4 3 1 1 1 3","G#ma7(#11)":"G#ma7(#11) base-fret 3 frets 2 x 3 3 1 x","G#2":"G#2 base-fret 0 frets 4 1 1 1 4 x","Am11":"Am11 base-fret 0 frets x 0 0 0 1 0","Ama7(#11)":"Ama7(#11) base-fret 0 frets x 0 1 1 2 x","B(2)":"B(2) base-fret 0 frets x 2 1 x 2 2","B9(#5)":"B9(#5) base-fret 0 frets x 2 1 2 2 3","B9sus4":"B9sus4 base-fret 0 frets x 2 2 2 2 2","A#(2)":"A#(2) base-fret 0 frets x 1 0 3 1 x","A#5":"A#5 base-fret 0 frets x 1 3 3 x x","A#6":"A#6 base-fret 0 frets x 1 3 3 3 3","A#6/9":"A#6/9 base-fret 0 frets x 1 0 0 1 1","A#7(b9)":"A#7(b9) base-fret 0 frets x 1 0 1 0 1","A#7sus4":"A#7sus4 base-fret 0 frets x 1 3 1 4 1","A#9(#5)":"A#9(#5) base-fret 0 frets x x 0 1 1 2","A#9sus4":"A#9sus4 base-fret 0 frets x 1 1 1 1 1","A#dim7":"A#dim7 base-fret 0 frets x x 2 3 2 3","A#m":"A#m base-fret 0 frets x 1 3 0 2 x","A#m(ma7)":"A#m(ma7) base-fret 0 frets x 1 3 2 2 1","A#ma7":"A#ma7 base-fret 0 frets x 1 3 2 3 1","A#ma7(#11)":"A#ma7(#11) base-fret 0 frets x 1 2 2 3 0","Bm(ma7)":"Bm(ma7) base-fret 0 frets x 2 0 3 3 2","Bma7(#11)":"Bma7(#11) base-fret 0 frets x 2 3 3 4 x","C(2)":"C(2) base-fret 0 frets x 3 2 0 3 0","C#5":"C#5 base-fret 0 frets x x x x 2 4","C13":"C13 base-fret 2 frets x 2 1 2 2 4","C6/9":"C6/9 base-fret 0 frets x 3 2 2 3 x","C7(#9)":"C7(#9) base-fret 0 frets x 3 2 3 4 x","C7(b5)":"C7(b5) base-fret 0 frets x 3 2 3 x 2","C9(#5)":"C9(#5) base-fret 0 frets x 3 2 3 3 4","C9(b5)":"C9(b5) base-fret 0 frets x 3 2 3 3 2","C9sus4":"C9sus4 base-fret 0 frets x 3 3 3 3 3","Cm(ma7)":"Cm(ma7) base-fret 0 frets x 3 1 0 0 3","Cm13":"Cm13 base-fret 3 frets x 1 1 1 2 3","Cm6":"Cm6 base-fret 0 frets x 3 1 2 1 x","Cm7(b5)":"Cm7(b5) base-fret 0 frets x 3 4 3 4 x","Cma7(#11)":"Cma7(#11) base-fret 3 frets x 1 2 2 3 x","D(2)":"D(2) base-fret 2 frets x 4 3 1 4 0","D6/9":"D6/9 base-fret 2 frets x 4 x 3 4 1","D9(#5)":"D9(#5) base-fret 3 frets x 3 2 3 3 4","D9(b5)":"D9(b5) base-fret 3 frets x 3 2 3 3 2","D9sus4":"D9sus4 base-fret 0 frets x x 0 0 1 0","C#":"C# base-fret 0 frets x 4 3 1 2 1","C#(2)":"C#(2) base-fret 0 frets x 4 3 1 4 x","C#6":"C#6 base-fret 0 frets x 4 3 3 2 x","C#6/9":"C#6/9 base-fret 0 frets x 4 3 3 4 4","C#7(#9)":"C#7(#9) base-fret 0 frets x 4 3 4 0 0","C#7sus4":"C#7sus4 base-fret 0 frets x 4 4 4 2 x","C#9(#5)":"C#9(#5) base-fret 3 frets x 2 1 2 2 3","C#9(b5)":"C#9(b5) base-fret 0 frets x 4 3 4 4 3","C#9sus4":"C#9sus4 base-fret 0 frets x 4 4 4 4 4","C#dim7":"C#dim7 base-fret 0 frets x x 2 3 2 3","C#m":"C#m base-fret 0 frets x 4 2 x 2 4","C#m(ma7)":"C#m(ma7) base-fret 0 frets x 4 2 1 1 4","C#m11":"C#m11 base-fret 0 frets x 4 2 4 4 2","C#m13":"C#m13 base-fret 3 frets x 2 2 2 3 4","C#m6":"C#m6 base-fret 0 frets x 4 2 3 2 x","C#ma7":"C#ma7 base-fret 0 frets x 4 3 1 1 1","C#ma7(#11)":"C#ma7(#11) base-fret 3 frets x 2 3 3 4 x","C#ma9":"C#ma9 base-fret 3 frets x 2 1 4 3 x","C#sus":"C#sus base-fret 0 frets x 4 4 1 2 x","Dm9":"Dm9 base-fret 2 frets x 4 2 1 4 0","Dm(ma7)":"Dm(ma7) base-fret 0 frets x x 0 2 2 1","Dm11":"Dm11 base-fret 3 frets x 3 1 3 3 1","Dm13":"Dm13 base-fret 5 frets x 1 1 1 2 3","Dm6":"Dm6 base-fret 0 frets x x 0 2 0 1","Dma7(#11)":"Dma7(#11) base-fret 5 frets x 1 2 2 3 x","E(2)":"E(2) base-fret 0 frets 0 2 2 1 0 2","E6/9":"E6/9 base-fret 0 frets 0 x 2 1 2 2","E9(#5)":"E9(#5) base-fret 0 frets 0 x 0 1 1 2","E9(b5)":"E9(b5) base-fret 0 frets 0 1 2 1 3 2","E9sus4":"E9sus4 base-fret 0 frets 0 2 0 2 0 2","D#":"D# base-fret 0 frets x x 1 3 4 3","D#aug":"D#aug base-fret 0 frets x x 1 0 0 x","D#(2)":"D#(2) base-fret 3 frets x 4 3 1 4 x","D#(b5)":"D#(b5) base-fret 5 frets x 2 1 2 2 1","D#5":"D#5 base-fret 0 frets x x 1 3 4 x","D#6":"D#6 base-fret 0 frets x x 1 3 1 3","D#6/9":"D#6/9 base-fret 0 frets x x 1 0 1 1","D#7sus4":"D#7sus4 base-fret 0 frets x x 1 1 2 4","D#9sus4":"D#9sus4 base-fret 0 frets x x 1 1 2 1","D#m":"D#m base-fret 0 frets x x 1 3 4 2","D#m(ma7)":"D#m(ma7) base-fret 0 frets x x 1 3 3 2","D#m11":"D#m11 base-fret 3 frets x 4 2 4 4 2","D#m13":"D#m13 base-fret 5 frets x 2 2 2 3 4","D#m7":"D#m7 base-fret 0 frets x x 1 3 2 2","D#m7(b5)":"D#m7(b5) base-fret 0 frets x x 1 2 2 2","D#ma7":"D#ma7 base-fret 0 frets x x 1 3 3 3","D#ma7(#11)":"D#ma7(#11) base-fret 5 frets x 2 3 3 4 x","D#sus":"D#sus base-fret 0 frets x 1 1 3 4 4","Em(ma7)":"Em(ma7) base-fret 0 frets 0 2 1 0 0 0","Em11":"Em11 base-fret 0 frets 0 2 0 2 0 3","Em13":"Em13 base-fret 0 frets 0 4 4 0 2 0","Em6":"Em6 base-fret 0 frets 0 2 2 0 2 0","Em7(b5)":"Em7(b5) base-fret 0 frets 0 x 2 3 3 3","Ema7(#11)":"Ema7(#11) base-fret 0 frets 0 x 2 3 4 4","F(2)":"F(2) base-fret 0 frets x x 3 2 1 3","F#":"F# base-fret 0 frets 3 x 2 4 3 x","F#(2)":"F#(2) base-fret 0 frets 2 x 4 3 2 4","F#5":"F#5 base-fret 0 frets 2 4 4 x x x","F#6/9":"F#6/9 base-fret 0 frets 2 1 1 1 2 x","F#aug7":"F#aug7 base-fret 0 frets 2 x 2 3 3 x","F#7(#9)":"F#7(#9) base-fret 0 frets 2 1 2 2 x x","F#7(b9)":"F#7(b9) base-fret 0 frets x x 2 3 2 3","F#7sus4":"F#7sus4 base-fret 0 frets 1 4 2 4 2 2","F#9(#5)":"F#9(#5) base-fret 0 frets 2 1 2 1 3 x","F#9(b5)":"F#9(b5) base-fret 0 frets 2 1 2 1 3 x","F#9sus4":"F#9sus4 base-fret 0 frets 2 4 2 4 2 4","F#m":"F#m base-fret 0 frets 2 4 4 2 2 2","F#m9":"F#m9 base-fret 0 frets 2 4 4 2 2 4","F#m(ma7)":"F#m(ma7) base-fret 0 frets 2 4 3 2 2 x","F#m11":"F#m11 base-fret 0 frets 2 x 2 2 0 0","F#m13":"F#m13 base-fret 0 frets 1 3 1 1 3 1","F#ma7":"F#ma7 base-fret 0 frets 2 x 3 3 2 x","F#ma7(#11)":"F#ma7(#11) base-fret 0 frets 2 x 3 3 1 x","F#2":"F#2 base-fret 0 frets 2 4 4 x 2 4","F6/9":"F6/9 base-fret 0 frets 1 0 0 0 1 1","F7(b5)":"F7(b5) base-fret 0 frets 1 0 1 2 0 x","F9(#5)":"F9(#5) base-fret 0 frets 1 0 1 0 2 x","F9(b5)":"F9(b5) base-fret 0 frets 1 0 1 0 0 x","F9sus4":"F9sus4 base-fret 0 frets 1 3 1 3 1 3","Fm(ma7)":"Fm(ma7) base-fret 0 frets 1 x x 1 1 0","Fm11":"Fm11 base-fret 0 frets 1 3 1 3 1 4","Fm13":"Fm13 base-fret 0 frets 1 3 1 1 3 1","Fma7(#11)":"Fma7(#11) base-fret 0 frets 1 x 2 2 0 0","Fma9":"Fma9 base-fret 0 frets 1 0 2 0 1 0","G(2)":"G(2) base-fret 0 frets 3 x 0 2 0 3","G#5":"G#5 base-fret 0 frets 4 x 1 1 4 x","G6/9":"G6/9 base-fret 0 frets 3 2 2 2 3 0","G9(#5)":"G9(#5) base-fret 0 frets 3 2 3 2 4 x","G9sus4":"G9sus4 base-fret 0 frets 3 x 3 2 1 1","Gm":"Gm base-fret 0 frets 3 x 0 3 3 3","Gm9":"Gm9 base-fret 0 frets 3 1 3 2 x 1","Gm(ma7)":"Gm(ma7) base-fret 0 frets 3 x 0 3 3 2","Gm13":"Gm13 base-fret 0 frets 3 x 3 3 1 0","Gm7":"Gm7 base-fret 0 frets 3 x 3 3 3 x","Gma7(#11)":"Gma7(#11) base-fret 0 frets 3 x 4 4 2 x","A(2)":"A(2) base-fret 0 frets x 0 2 4 2 0","A(4)":"A(4) base-fret 0 frets x 0 0 2 2 0","Am2":"Am2 base-fret 0 frets x 0 2 4 1 0","A6/9":"A6/9 base-fret 0 frets x 0 2 4 2 2","A13sus4":"A13sus4 base-fret 0 frets x 0 0 0 0 2","Am(ma7)":"Am(ma7) base-fret 0 frets x x x 2 1 4","Am(ma9)":"Am(ma9) base-fret 2 frets x 0 1 4 0 3","A7(#9)":"A7(#9) base-fret 2 frets 4 x 1 4 1 2","Am7(#5)":"Am7(#5) base-fret 0 frets x 0 3 2 1 3","Ama7(#5)":"Ama7(#5) base-fret 0 frets x 0 3 1 2 1","Ama7(b5)":"Ama7(b5) base-fret 0 frets x 0 1 2 2 4","A/A#":"A/A# base-fret 0 frets x 1 2 2 2 x","A/C":"A/C base-fret 0 frets x 3 2 2 2 x","A/D#":"A/D# base-fret 0 frets x x 1 2 2 0","A/F":"A/F base-fret 0 frets 1 4 2 2 x x","Am/A#":"Am/A# base-fret 0 frets x 1 2 2 1 x","Am/B":"Am/B base-fret 0 frets x 2 2 2 1 x","Am/C#":"Am/C# base-fret 0 frets x 4 2 2 1 x","Am/D":"Am/D base-fret 0 frets x x 0 2 1 0","Am/D#":"Am/D# base-fret 0 frets x x 1 2 1 0","Am/E":"Am/E base-fret 0 frets x x 2 2 1 x","Am/F":"Am/F base-fret 0 frets 1 3 2 2 x x","Am/F#":"Am/F# base-fret 0 frets 2 3 2 2 x x","Am/G":"Am/G base-fret 0 frets 3 3 2 2 x x","Am/G#":"Am/G# base-fret 0 frets 4 3 2 2 x x","A#":"A# base-fret 0 frets x 1 3 3 3 1","A#(4)":"A#(4) base-fret 0 frets x 1 1 3 3 1","A#m2":"A#m2 base-fret 3 frets 4 1 1 4 4 x","A#aug":"A#aug base-fret 0 frets x x x 3 3 2","A#dim":"A#dim base-fret 0 frets x 1 2 3 2 x","A#13sus4":"A#13sus4 base-fret 0 frets x 1 1 1 4 3","A#m(ma9)":"A#m(ma9) base-fret 3 frets 4 2 x 3 4 3","A#m7(#5)":"A#m7(#5) base-fret 0 frets x 1 4 1 2 x","A#ma7(#5)":"A#ma7(#5) base-fret 0 frets x 1 4 2 3 2","A#ma7(b5)":"A#ma7(b5) base-fret 0 frets x 1 2 2 3 x","A#/A":"A#/A base-fret 0 frets x 0 0 3 3 1","A#/B":"A#/B base-fret 0 frets x 2 3 3 3 x","A#/C":"A#/C base-fret 0 frets x 3 3 3 3 x","A#/C#":"A#/C# base-fret 0 frets x 4 3 3 3 x","A#/D#":"A#/D# base-fret 0 frets x x 1 3 3 1","A#/E":"A#/E base-fret 0 frets 0 1 3 x 3 1","A#/F#":"A#/F# base-fret 0 frets 2 1 3 x 3 1","A#/G":"A#/G base-fret 0 frets 3 1 3 x 3 1","A#/G#":"A#/G# base-fret 0 frets 4 1 3 x 3 1","A#m/A":"A#m/A base-fret 0 frets x 0 3 3 2 1","A#m/B":"A#m/B base-fret 0 frets x 2 3 3 2 x","A#m/C":"A#m/C base-fret 0 frets x 3 3 3 2 x","A#m/C#":"A#m/C# base-fret 0 frets x 4 3 3 x x","A#m/D":"A#m/D base-fret 0 frets x x 0 3 2 1","A#m/D#":"A#m/D# base-fret 0 frets x x 1 3 2 1","A#m/E":"A#m/E base-fret 0 frets 0 1 3 3 2 1","A#m/F":"A#m/F base-fret 0 frets 1 1 3 3 2 1","A#m/F#":"A#m/F# base-fret 0 frets 2 1 x 3 2 1","A#m/G":"A#m/G base-fret 0 frets 3 1 3 x 2 1","A#m/G#":"A#m/G# base-fret 0 frets 4 1 3 x 2 1","B(4)":"B(4) base-fret 0 frets x 2 2 4 4 2","Bm2":"Bm2 base-fret 0 frets x 2 0 x 2 2","B13sus4":"B13sus4 base-fret 0 frets x 2 2 2 0 4","Bm(ma9)":"Bm(ma9) base-fret 0 frets x 2 0 3 2 x","Bm7(#5)":"Bm7(#5) base-fret 0 frets x 2 x 2 3 3","Bma7(#5)":"Bma7(#5) base-fret 0 frets x 2 1 3 4 3","Bma7(b5)":"Bma7(b5) base-fret 0 frets x 2 1 3 4 1","B/C":"B/C base-fret 0 frets x 3 4 4 4 x","B/D":"B/D base-fret 0 frets x x 0 4 4 2","B/F":"B/F base-fret 0 frets 1 2 1 x 4 2","B/G":"B/G base-fret 0 frets 3 2 4 x 4 2","Bm/A":"Bm/A base-fret 0 frets x 0 0 4 3 2","Bm/A#":"Bm/A# base-fret 0 frets x 1 x 4 3 2","Bm/C":"Bm/C base-fret 0 frets x 3 4 4 3 x","Bm/C#":"Bm/C# base-fret 0 frets x 4 4 4 3 x","Bm/D#":"Bm/D# base-fret 0 frets x x 1 4 3 2","Bm/E":"Bm/E base-fret 0 frets 0 2 0 4 3 2","Bm/F":"Bm/F base-fret 0 frets x x 3 4 3 2","Bm/F#":"Bm/F# base-fret 0 frets 2 2 4 4 3 2","Bm/G":"Bm/G base-fret 0 frets 3 2 x 4 3 2","Bm/G#":"Bm/G# base-fret 0 frets 4 2 4 x 3 2","C(4)":"C(4) base-fret 0 frets x 3 2 0 1 1","Cm2":"Cm2 base-fret 0 frets x 3 1 x 3 3","C13sus4":"C13sus4 base-fret 3 frets x 1 1 1 4 3","Cm(ma9)":"Cm(ma9) base-fret 0 frets x 3 1 4 3 3","Cm7(#5)":"Cm7(#5) base-fret 0 frets x 3 1 3 1 4","Cma7(#5)":"Cma7(#5) base-fret 0 frets x 3 2 4 x 4","Cma7(b5)":"Cma7(b5) base-fret 0 frets x 3 2 4 x 2","C/C#":"C/C# base-fret 0 frets x 4 2 x 1 3","C/D#":"C/D# base-fret 0 frets x x 1 0 1 0","C/F#":"C/F# base-fret 0 frets 2 3 2 x x 3","C/G#":"C/G# base-fret 0 frets 4 3 2 0 x 0","Cm/A":"Cm/A base-fret 0 frets x 0 1 0 1 3","Cm/A#":"Cm/A# base-fret 0 frets x 1 1 x 1 3","Cm/B":"Cm/B base-fret 0 frets x 2 1 x 1 3","Cm/C#":"Cm/C# base-fret 0 frets x 4 1 0 1 x","Cm/D":"Cm/D base-fret 3 frets x 3 3 3 2 x","Cm/E":"Cm/E base-fret 0 frets 0 3 1 0 1 x","Cm/F":"Cm/F base-fret 0 frets 1 3 1 0 x x","Cm/F#":"Cm/F# base-fret 0 frets 2 3 1 x x 3","Cm/G":"Cm/G base-fret 0 frets 3 3 1 x x x","Cm/G#":"Cm/G# base-fret 0 frets 4 3 x x 4 3","C#(4)":"C#(4) base-fret 0 frets x 4 4 1 2 1","C#m2":"C#m2 base-fret 0 frets x 4 2 1 4 4","C#aug":"C#aug base-fret 0 frets x 4 3 2 2 x","C#dim":"C#dim base-fret 0 frets x 4 2 x 2 3","C#13sus4":"C#13sus4 base-fret 3 frets x 2 2 2 0 4","C#m(ma9)":"C#m(ma9) base-fret 2 frets x 3 1 4 3 3","C#m7(#5)":"C#m7(#5) base-fret 0 frets x 4 2 2 0 0","C#ma7(#5)":"C#ma7(#5) base-fret 0 frets x 4 3 2 1 1","C#ma7(b5)":"C#ma7(b5) base-fret 0 frets x 4 3 x 1 3","C#/A":"C#/A base-fret 0 frets x 0 3 1 2 1","C#/A#":"C#/A# base-fret 0 frets x 1 3 1 2 1","C#/B":"C#/B base-fret 0 frets x 2 3 1 2 1","C#/C":"C#/C base-fret 0 frets x 3 3 1 2 1","C#/D":"C#/D base-fret 0 frets x x 0 1 2 1","C#/D#":"C#/D# base-fret 0 frets x x 1 1 2 1","C#/E":"C#/E base-fret 0 frets 0 4 3 1 2 1","C#/F":"C#/F base-fret 0 frets x x 3 1 2 1","C#/F#":"C#/F# base-fret 0 frets x x 4 1 2 1","C#/G":"C#/G base-fret 0 frets 3 x 3 1 2 1","C#m/A":"C#m/A base-fret 0 frets x 0 2 1 2 0","C#m/A#":"C#m/A# base-fret 0 frets x 1 2 1 2 x","C#m/B":"C#m/B base-fret 0 frets x 2 2 1 2 x","C#m/C":"C#m/C base-fret 0 frets x 3 2 1 2 x","C#m/D":"C#m/D base-fret 0 frets x x 0 1 2 0","C#m/D#":"C#m/D# base-fret 0 frets x x 1 1 2 0","C#m/E":"C#m/E base-fret 0 frets x x 2 1 2 x","C#m/F":"C#m/F base-fret 0 frets 1 x 2 1 2 4","C#m/F#":"C#m/F# base-fret 0 frets 2 x 2 1 2 x","C#m/G":"C#m/G base-fret 0 frets 3 4 2 1 x x","C#m/G#":"C#m/G# base-fret 0 frets 4 4 2 x x x","D(4)":"D(4) base-fret 2 frets x 4 4 1 2 1","Dm2":"Dm2 base-fret 2 frets x 4 2 1 4 4","D13sus4":"D13sus4 base-fret 5 frets x 1 1 1 4 3","Dm(ma9)":"Dm(ma9) base-fret 2 frets x 4 2 x 1 0","Dm7(#5)":"Dm7(#5) base-fret 0 frets x x 0 3 1 1","Dma7(#5)":"Dma7(#5) base-fret 0 frets x x 0 3 2 2","Dma7(b5)":"Dma7(b5) base-fret 0 frets x x 0 1 2 2","D/A#":"D/A# base-fret 0 frets x 1 4 2 3 2","D/D#":"D/D# base-fret 0 frets x x 1 2 3 2","D/F":"D/F base-fret 0 frets x x 3 2 3 2","D/G#":"D/G# base-fret 0 frets 4 x 4 2 3 2","Dm/A":"Dm/A base-fret 0 frets x x x 2 3 1","Dm/A#":"Dm/A# base-fret 0 frets x 1 3 2 3 1","Dm/B":"Dm/B base-fret 0 frets x 2 3 2 3 x","Dm/C":"Dm/C base-fret 0 frets x 3 3 2 3 x","Dm/C#":"Dm/C# base-fret 0 frets x 4 3 2 3 x","Dm/D#":"Dm/D# base-fret 0 frets x x 1 2 3 1","Dm/E":"Dm/E base-fret 0 frets 0 0 0 2 3 1","Dm/F#":"Dm/F# base-fret 0 frets 2 x 3 2 3 x","Dm/G":"Dm/G base-fret 0 frets 3 x 3 2 3 x","Dm/G#":"Dm/G# base-fret 0 frets 4 x 3 2 3 x","D#(4)":"D#(4) base-fret 3 frets x 4 4 1 2 1","D#m2":"D#m2 base-fret 3 frets x 4 2 1 4 4","D#dim":"D#dim base-fret 0 frets x x 1 2 4 2","D#m6":"D#m6 base-fret 0 frets x x 1 3 1 2","D#13sus4":"D#13sus4 base-fret 6 frets x 1 1 1 4 3","D#m(ma9)":"D#m(ma9) base-fret 4 frets x 3 1 4 3 x","D#m7(#5)":"D#m7(#5) base-fret 0 frets x x 1 4 2 2","D#ma7(#5)":"D#ma7(#5) base-fret 0 frets x x 1 4 3 3","D#ma7(b5)":"D#ma7(b5) base-fret 0 frets x x 1 2 3 3","D#9(#5)":"D#9(#5) base-fret 5 frets x 2 1 2 2 3","D#9(b5)":"D#9(b5) base-fret 5 frets x 2 1 2 2 1","D#/A":"D#/A base-fret 0 frets x 0 1 3 4 3","D#/B":"D#/B base-fret 0 frets x 2 1 3 4 3","D#/C":"D#/C base-fret 0 frets x 3 1 3 4 3","D#/C#":"D#/C# base-fret 0 frets x 4 x 3 4 3","D#/D":"D#/D base-fret 0 frets x x 0 3 4 3","D#/E":"D#/E base-fret 0 frets 0 x 1 3 4 3","D#/F":"D#/F base-fret 0 frets 1 1 1 3 4 3","D#/F#":"D#/F# base-fret 0 frets x x 4 3 4 3","D#/G":"D#/G base-fret 0 frets 3 1 1 3 4 x","D#/G#":"D#/G# base-fret 0 frets 4 x x 3 4 3","D#m/A":"D#m/A base-fret 0 frets x 0 4 3 4 2","D#m/A#":"D#m/A# base-fret 0 frets x 1 1 3 4 2","D#m/B":"D#m/B base-fret 0 frets x 2 4 3 4 2","D#m/C":"D#m/C base-fret 0 frets x 3 4 3 4 x","D#m/C#":"D#m/C# base-fret 0 frets x 4 4 3 4 x","D#m/D":"D#m/D base-fret 0 frets x x 0 3 4 2","D#m/E":"D#m/E base-fret 0 frets 0 x 4 3 4 2","D#m/F":"D#m/F base-fret 0 frets 1 1 1 3 4 2","D#m/F#":"D#m/F# base-fret 0 frets 2 x 4 3 4 2","D#m/G":"D#m/G base-fret 0 frets 3 1 1 3 x 2","D#m/G#":"D#m/G# base-fret 0 frets 4 1 1 3 x 2","E(4)":"E(4) base-fret 0 frets 0 0 2 1 0 0","Em2":"Em2 base-fret 0 frets 0 2 4 0 0 0","E13sus4":"E13sus4 base-fret 0 frets 0 0 0 2 2 2","Em(ma9)":"Em(ma9) base-fret 0 frets 0 2 1 0 0 2","Em7(#5)":"Em7(#5) base-fret 0 frets 0 3 0 0 3 0","Ema7(#5)":"Ema7(#5) base-fret 0 frets 0 3 2 1 4 0","Ema7(b5)":"Ema7(b5) base-fret 0 frets x x 2 3 4 4","E/A#":"E/A# base-fret 0 frets x 1 2 4 x 4","E/C":"E/C base-fret 0 frets x 3 2 4 x 4","E/F":"E/F base-fret 0 frets 1 2 2 1 x 4","E/G":"E/G base-fret 0 frets 3 2 2 4 x 4","Em/A":"Em/A base-fret 0 frets x 0 2 0 0 0","Em/A#":"Em/A# base-fret 0 frets x 1 2 4 x 3","Em/B":"Em/B base-fret 0 frets x 2 2 4 x 3","Em/C":"Em/C base-fret 0 frets x 3 2 4 x 3","Em/C#":"Em/C# base-fret 0 frets x 4 2 4 x 3","Em/D":"Em/D base-fret 0 frets x x 0 0 0 0","Em/D#":"Em/D# base-fret 0 frets x x 1 0 0 0","Em/F":"Em/F base-fret 0 frets 1 2 2 4 x 3","Em/F#":"Em/F# base-fret 0 frets x x 4 0 0 0","Em/G#":"Em/G# base-fret 0 frets 4 2 2 4 x 3","F(4)":"F(4) base-fret 0 frets 1 1 3 2 1 1","Fm2":"Fm2 base-fret 0 frets x x 3 1 1 3","F11":"F11 base-fret 0 frets 1 0 1 3 x x","F13sus4":"F13sus4 base-fret 0 frets 1 3 1 3 3 1","Fm(ma9)":"Fm(ma9) base-fret 0 frets 1 3 2 1 1 3","Fm7(#5)":"Fm7(#5) base-fret 0 frets 1 4 1 1 4 1","Fma7(#5)":"Fma7(#5) base-fret 0 frets 1 x 2 2 2 1","Fma7(b5)":"Fma7(b5) base-fret 0 frets 1 2 2 2 x 1","F/B":"F/B base-fret 0 frets x 2 3 2 1 1","F/C#":"F/C# base-fret 0 frets x 4 3 2 1 1","F/F#":"F/F# base-fret 0 frets 2 x 3 2 1 1","F/G#":"F/G# base-fret 0 frets 4 3 x 2 1 1","Fm/A":"Fm/A base-fret 0 frets x 0 3 1 1 1","Fm/A#":"Fm/A# base-fret 0 frets x 1 3 1 1 1","Fm/B":"Fm/B base-fret 0 frets x 2 3 1 1 1","Fm/C":"Fm/C base-fret 0 frets x 3 3 1 1 1","Fm/C#":"Fm/C# base-fret 0 frets x 4 3 1 1 1","Fm/D":"Fm/D base-fret 0 frets x x 0 1 1 1","Fm/D#":"Fm/D# base-fret 0 frets x x 1 1 1 1","Fm/E":"Fm/E base-fret 0 frets 0 3 3 1 1 1","Fm/F#":"Fm/F# base-fret 0 frets 2 3 3 1 1 1","Fm/G":"Fm/G base-fret 0 frets 3 3 3 1 1 1","Fm/G#":"Fm/G# base-fret 0 frets x x x 1 1 1","F#(4)":"F#(4) base-fret 0 frets 2 2 4 3 2 2","F#m2":"F#m2 base-fret 0 frets x x 4 2 2 4","F#aug":"F#aug base-fret 0 frets 2 x 4 3 3 2","F#dim":"F#dim base-fret 0 frets 2 3 4 2 x x","F#11":"F#11 base-fret 0 frets 2 1 2 4 x x","F#13sus4":"F#13sus4 base-fret 0 frets 2 4 2 4 4 2","F#m(ma9)":"F#m(ma9) base-fret 0 frets 2 4 3 2 2 4","F#m7(#5)":"F#m7(#5) base-fret 0 frets 2 x 2 2 3 2","F#ma7(#5)":"F#ma7(#5) base-fret 0 frets 2 x 3 3 3 2","F#ma7(b5)":"F#ma7(b5) base-fret 0 frets 2 1 3 3 1 1","F#/A":"F#/A base-fret 0 frets x 0 4 3 2 2","F#/A#":"F#/A# base-fret 0 frets x x x 3 2 2","F#/B":"F#/B base-fret 0 frets x 2 4 3 2 2","F#/C":"F#/C base-fret 0 frets x 3 4 3 2 2","F#/D":"F#/D base-fret 0 frets x x 0 3 2 2","F#/D#":"F#/D# base-fret 0 frets x x 1 3 2 2","F#/E":"F#/E base-fret 0 frets 0 4 4 3 2 2","F#/F":"F#/F base-fret 0 frets x x 3 3 2 2","F#/G":"F#/G base-fret 0 frets 3 x 4 3 2 2","F#/G#":"F#/G# base-fret 0 frets 4 x 4 3 2 2","F#m/A#":"F#m/A# base-fret 0 frets x 1 4 2 2 2","F#m/B":"F#m/B base-fret 0 frets x 2 4 2 2 2","F#m/C":"F#m/C base-fret 0 frets x 3 4 2 2 2","F#m/C#":"F#m/C# base-fret 0 frets x 4 4 2 2 2","F#m/D":"F#m/D base-fret 0 frets x x 0 2 2 2","F#m/D#":"F#m/D# base-fret 0 frets x x 1 2 2 2","F#m/E":"F#m/E base-fret 0 frets 0 0 4 2 2 2","F#m/F":"F#m/F base-fret 0 frets x x 3 2 2 2","F#m/G":"F#m/G base-fret 0 frets 3 4 4 2 2 2","F#m/G#":"F#m/G# base-fret 0 frets 4 4 4 2 2 2","G(4)":"G(4) base-fret 0 frets 3 3 x 4 3 3","Gm2":"Gm2 base-fret 0 frets 3 1 x 2 3 x","G13sus4":"G13sus4 base-fret 0 frets 3 3 3 0 3 0","Gm(ma9)":"Gm(ma9) base-fret 0 frets 3 1 4 2 x x","Gm7(#5)":"Gm7(#5) base-fret 0 frets 3 1 1 3 4 1","Gma7(#5)":"Gma7(#5) base-fret 0 frets 3 2 4 x 4 2","Gma7(b5)":"Gma7(b5) base-fret 0 frets 3 2 4 4 2 2","G/A#":"G/A# base-fret 0 frets x 1 x 4 3 3","G/C#":"G/C# base-fret 0 frets x 4 x 4 3 3","G/D#":"G/D# base-fret 0 frets x x 1 4 3 3","G/G#":"G/G# base-fret 0 frets 4 x x 4 3 3","Gm/A":"Gm/A base-fret 0 frets x 0 0 3 3 3","Gm/A#":"Gm/A# base-fret 0 frets x x x 3 3 3","Gm/B":"Gm/B base-fret 0 frets x 2 x 3 3 3","Gm/C":"Gm/C base-fret 0 frets x 3 x 3 3 3","Gm/C#":"Gm/C# base-fret 0 frets x 4 x 3 3 3","Gm/D":"Gm/D base-fret 0 frets x x 0 3 3 3","Gm/D#":"Gm/D# base-fret 0 frets x x 1 3 3 3","Gm/E":"Gm/E base-fret 0 frets 0 1 0 0 x x","Gm/F":"Gm/F base-fret 0 frets x x 3 3 3 3","Gm/F#":"Gm/F# base-fret 0 frets x x 4 3 3 3","Gm/G#":"Gm/G# base-fret 0 frets 4 x x 3 3 3","G#(4)":"G#(4) base-fret 0 frets 4 3 1 1 2 x","G#m2":"G#m2 base-fret 0 frets 4 1 1 4 4 x","G#aug":"G#aug base-fret 0 frets 4 x 2 1 1 4","G#dim":"G#dim base-fret 0 frets 4 2 x 4 3 x","G#13sus4":"G#13sus4 base-fret 0 frets 4 x 4 1 2 1","G#m(ma9)":"G#m(ma9) base-fret 0 frets 4 2 x 3 4 3","G#m7(#5)":"G#m7(#5) base-fret 0 frets 4 2 2 4 x 2","G#ma7(#5)":"G#ma7(#5) base-fret 0 frets 4 x 2 1 1 3","G#ma7(b5)":"G#ma7(b5) base-fret 0 frets 4 3 x 1 3 3","G#/A":"G#/A base-fret 0 frets x 0 1 1 1 x","G#/A#":"G#/A# base-fret 0 frets x 1 1 1 1 4","G#/B":"G#/B base-fret 0 frets x 2 1 1 1 4","G#/C":"G#/C base-fret 0 frets x 3 1 1 4 x","G#/C#":"G#/C# base-fret 0 frets x 4 1 1 1 4","G#/D":"G#/D base-fret 3 frets x 3 4 3 2 2","G#/E":"G#/E base-fret 0 frets 0 3 1 1 x x","G#/F":"G#/F base-fret 0 frets 1 3 1 1 1 4","G#/F#":"G#/F# base-fret 0 frets 2 3 1 1 4 x","G#/G":"G#/G base-fret 0 frets 3 3 1 1 4 x","G#m/A":"G#m/A base-fret 0 frets x 0 1 4 4 4","G#m/A#":"G#m/A# base-fret 0 frets x 1 1 4 4 4","G#m/B":"G#m/B base-fret 0 frets x x x 4 4 4","G#m/C":"G#m/C base-fret 0 frets x 3 1 4 4 4","G#m/C#":"G#m/C# base-fret 0 frets x 4 x 4 4 4","G#m/D":"G#m/D base-fret 0 frets x x 0 4 4 4","G#m/D#":"G#m/D# base-fret 0 frets x x 1 4 4 4","G#m/E":"G#m/E base-fret 0 frets 0 2 1 1 0 x","G#m/F":"G#m/F base-fret 0 frets 1 2 1 1 4 x","G#m/F#":"G#m/F# base-fret 0 frets x x 4 4 4 4","G#m/G":"G#m/G base-fret 0 frets 3 2 1 1 4 x","Am(4)":"Am(4) base-fret 0 frets x 0 0 2 1 0","Am6/9":"Am6/9 base-fret 0 frets x 0 4 4 1 2","Am6/7":"Am6/7 base-fret 0 frets x 0 2 0 1 2","Am7(4)":"Am7(4) base-fret 0 frets x 0 0 0 1 0","Ama11":"Ama11 base-fret 3 frets 3 2 4 x 1 x","Ama13":"Ama13 base-fret 0 frets x 0 2 1 2 2","A#m(4)":"A#m(4) base-fret 0 frets x 1 1 3 2 1","A#m6/9":"A#m6/9 base-fret 3 frets 4 2 1 3 x 1","A#m6/7":"A#m6/7 base-fret 0 frets x 1 3 1 2 3","A#m7(4)":"A#m7(4) base-fret 0 frets x 1 1 1 2 1","A#ma11":"A#ma11 base-fret 0 frets x 1 0 2 4 x","A#ma13":"A#ma13 base-fret 0 frets x 1 3 2 3 3","Bm(4)":"Bm(4) base-fret 0 frets x 2 2 4 3 2","Bm6/9":"Bm6/9 base-fret 0 frets x 2 0 1 2 2","Bm6/7":"Bm6/7 base-fret 0 frets x 2 4 2 3 4","Bm7(4)":"Bm7(4) base-fret 0 frets x 2 2 2 3 2","Bma11":"Bma11 base-fret 0 frets x 2 1 3 0 0","Bma13":"Bma13 base-fret 0 frets x 2 4 3 4 4","Cm(4)":"Cm(4) base-fret 0 frets x 3 3 x 4 3","Cm6/9":"Cm6/9 base-fret 0 frets x 3 1 2 3 x","Cm6/7":"Cm6/7 base-fret 3 frets x 1 3 1 2 3","Cm7(4)":"Cm7(4) base-fret 0 frets x 3 1 3 1 1","Cma11":"Cma11 base-fret 0 frets x 3 2 4 1 1","Cma13":"Cma13 base-fret 2 frets x 2 1 3 4 4","C#m(4)":"C#m(4) base-fret 0 frets x 4 2 1 2 2","C#m6/9":"C#m6/9 base-fret 0 frets x 4 2 3 4 4","C#m6/7":"C#m6/7 base-fret 0 frets x 4 2 3 0 0","C#m7(4)":"C#m7(4) base-fret 0 frets x 4 2 4 2 2","C#ma11":"C#ma11 base-fret 0 frets x 4 3 1 1 2","C#ma13":"C#ma13 base-fret 3 frets x 2 4 3 4 4","Dm(4)":"Dm(4) base-fret 2 frets x 4 2 1 2 2","Dm6/9":"Dm6/9 base-fret 2 frets x 4 2 1 0 0","Dm6/7":"Dm6/7 base-fret 0 frets x x 0 4 1 1","Dm7(4)":"Dm7(4) base-fret 0 frets x x 0 0 1 1","Dma11":"Dma11 base-fret 2 frets x 4 3 1 1 2","Dma13":"Dma13 base-fret 4 frets x 2 1 3 4 4","D#m(4)":"D#m(4) base-fret 3 frets x 4 2 1 2 2","D#m6/9":"D#m6/9 base-fret 3 frets x 4 2 3 4 4","D#m6/7":"D#m6/7 base-fret 5 frets x 2 4 2 3 4","D#m7(4)":"D#m7(4) base-fret 0 frets x x 1 1 2 2","D#ma11":"D#ma11 base-fret 0 frets x x 1 0 3 4","D#ma13":"D#ma13 base-fret 5 frets x 2 4 3 4 4","Em(4)":"Em(4) base-fret 0 frets 0 0 2 0 0 0","Em6/9":"Em6/9 base-fret 0 frets 0 2 2 0 2 2","Em6/7":"Em6/7 base-fret 0 frets 0 4 0 0 0 0","Em7(4)":"Em7(4) base-fret 0 frets x x 2 2 3 3","Ema11":"Ema11 base-fret 0 frets 0 x 4 2 4 4","Ema13":"Ema13 base-fret 0 frets 0 2 1 1 2 0","Fm(4)":"Fm(4) base-fret 0 frets 1 1 3 1 1 1","Fm6/9":"Fm6/9 base-fret 0 frets 1 3 x 1 3 3","Fm6/7":"Fm6/7 base-fret 0 frets 1 3 1 1 3 1","Fm7(4)":"Fm7(4) base-fret 0 frets 1 1 1 1 1 1","Fma11":"Fma11 base-fret 0 frets 1 0 2 3 1 0","Fma13":"Fma13 base-fret 0 frets 1 x 2 2 3 1","F#m(4)":"F#m(4) base-fret 0 frets 2 2 4 2 2 2","F#m6/9":"F#m6/9 base-fret 0 frets 2 x 4 2 4 4","F#m6/7":"F#m6/7 base-fret 0 frets 2 4 2 2 4 2","F#m7(4)":"F#m7(4) base-fret 0 frets 2 2 2 2 2 2","F#ma11":"F#ma11 base-fret 0 frets 2 1 3 4 x 1","F#ma13":"F#ma13 base-fret 0 frets 2 1 3 1 4 1","Gm(4)":"Gm(4) base-fret 0 frets 3 3 x 3 3 3","Gm6/9":"Gm6/9 base-fret 0 frets 3 1 2 2 3 x","Gm6/7":"Gm6/7 base-fret 0 frets 3 1 2 3 x 1","Gm7(4)":"Gm7(4) base-fret 0 frets 3 3 3 3 3 3","Gma11":"Gma11 base-fret 0 frets 3 2 4 x 1 x","Gma13":"Gma13 base-fret 0 frets 3 2 4 0 0 0","G#m(4)":"G#m(4) base-fret 0 frets 4 2 1 1 2 x","G#m6/9":"G#m6/9 base-fret 0 frets 4 2 1 3 x 1","G#m6/7":"G#m6/7 base-fret 0 frets 4 2 3 4 x 2","G#m7(4)":"G#m7(4) base-fret 0 frets 4 4 4 4 4 4","G#ma11":"G#ma11 base-fret 0 frets 4 3 x x 2 3","G#ma13":"G#ma13 base-fret 0 frets 4 3 x 0 2 1"}');var Vr=class r{constructor(s){this.definitions=s||{}}get(s){return this.definitions[s]||null}withDefaults(){let s=hc(ha),e=this.clone();return Object.keys(s).forEach(a=>{let f=Un.parse(s[a]);e.has(a)||e.add(a,f)}),e}add(s,e){this.definitions[s]=e}has(s){return s in this.definitions}clone(){let s=new r;return Object.keys(this.definitions).forEach(e=>{s.add(e,this.definitions[e].clone())}),s}},Lf=Vr,Kr=class r{constructor({font:s,size:e,colour:a}={font:null,size:null,colour:null}){this.font=null,this.size=null,this.colour=null,this.font=s?s.replace(/"/g,"'"):null,this.size=e||null,this.colour=a||null}clone(){return new r({font:this.font,size:this.size,colour:this.colour})}toCssString(){let s={};return this.colour&&(s.color=this.colour),this.font&&this.size?s.font=`${this.size} ${this.font}`:this.font?s["font-family"]=this.font:this.size&&(s["font-size"]=`${this.size}`),Object.keys(s).map(e=>`${e}: ${s[e]}`).join("; ")}},Yt=Kr,qr=class r{constructor({type:s,items:e}={type:Xs,items:[]}){this.items=[],this.type=Xs,this.currentChordLyricsPair=new we,this.key=null,this.transposeKey=null,this.lineNumber=null,this.selector=null,this.selectorIsNegated=!1,this.textFont=new Yt,this.chordFont=new Yt,this.type=s,this.items=e}isEmpty(){return this.items.length===0}addItem(s){if(s instanceof fe)this.addTag(s);else if(s instanceof we)this.addChordLyricsPair(s);else if(s instanceof tt)this.addComment(s);else{let e=s;e.parentLine=this,this.items.push(e)}}hasRenderableItems(){return this.items.some(s=>s.isRenderable())}clone(){return this.mapItems(null)}mapItems(s){let e=new r;return e.items=this.items.map(a=>{let f=a.clone();return s?s(f):f}).filter(a=>a!==null),e.type=this.type,e}isBridge(){return this.type===ot}isChorus(){return this.type===Ts}isGrid(){return this.type===li}isTab(){return this.type===ui}isVerse(){return this.type===ct}isPart(){return this.type===Zt}hasContent(){return this.hasRenderableItems()}addChordLyricsPair(s=null,e=null){return s instanceof we?this.currentChordLyricsPair=s:this.currentChordLyricsPair=new we(s||"",e||""),this.currentChordLyricsPair.parentLine=this,this.items.push(this.currentChordLyricsPair),this.currentChordLyricsPair}ensureChordLyricsPair(){this.currentChordLyricsPair||this.addChordLyricsPair()}chords(s){this.ensureChordLyricsPair(),this.currentChordLyricsPair.chords+=s}lyrics(s){this.ensureChordLyricsPair(),this.currentChordLyricsPair.lyrics+=s}addTag(s,e=null){let a=s instanceof fe?s:new fe(s,e);return a.parentLine=this,this.items.push(a),a}addComment(s){let e=s instanceof tt?s:new tt(s);return e.parentLine=this,this.items.push(e),e}set(s){return new r({type:this.type,items:this.items,...s})}get _tag(){if(this.items.length!==1)return null;let s=this.items[0];return s instanceof fe?s:null}isSectionStart(){var s;return((s=this._tag)==null?void 0:s.isSectionStart())||!1}isSectionEnd(){var s;return((s=this._tag)==null?void 0:s.isSectionEnd())||!1}},Ur=qr,Yr=class r{static expand(s,e){return new r(s,e).expand()}constructor(s,e){this.line=s,this.song=e}expand(){let s=this.line.items.flatMap(e=>e instanceof fe&&e.name===Ts?this.getLastChorusBefore(this.line.lineNumber):[]);return[this.line,...s]}getLastChorusBefore(s){let e=[];if(!s)return e;for(let a=s-1;a>=0;a-=1){let f=this.song.lines[a];if(f.type!==Ts&&e.length>0)break;f.type===Ts&&(f.isEmpty()||this.lineHasMoreThanChorusDirectives(f))&&e.unshift(f)}return e}lineHasMoreThanChorusDirectives(s){return s.items.some(e=>!(e instanceof fe&&(e.name===ut||e.name===Qt)))}},Ff=Yr,Xr=class{get key(){return this.getSingleMetadataValue(Ms)}get title(){return this.getSingleMetadataValue(Ai)}get subtitle(){return this.getSingleMetadataValue(Ci)}get capo(){return this.getMetadataValue(Jt)}get duration(){return this.getSingleMetadataValue(ea)}get tempo(){return this.getSingleMetadataValue(fa)}get time(){return this.getMetadataValue(la)}get year(){return this.getSingleMetadataValue(ma)}get album(){return this.getMetadataValue(Xn)}get copyright(){return this.getSingleMetadataValue(Qn)}get lyricist(){return this.getMetadataValue(ia)}get artist(){return this.getMetadataValue(Zn)}get composer(){return this.getMetadataValue(Jn)}},da=Xr;function vf(r,s){r.includes(s)||r.push(s)}var Zr=class r extends da{constructor(s={}){super(),this.metadata={},this.providers=new Map,s instanceof r?this.assign(s.metadata):this.assign(s)}merge(s={}){let e=this.clone();return s instanceof r?e.assign(s.metadata):e.assign(s),e}contains(s){return s in this.metadata}add(s,e){if(!wn(s)){if(!(s in this.metadata)){this.metadata[s]=e;return}this.appendValue(s,e)}}appendValue(s,e){let a=this.metadata[s];if(a!==e){if(a instanceof Array){vf(a,e);return}this.metadata[s]=[a,e]}}setProvider(s,e){this.providers.set(s,e)}set(s,e){e?this.metadata[s]=e:delete this.metadata[s]}getMetadataValue(s){return this.get(s)}getSingleMetadataValue(s){return this.getSingle(s)}get(s){if(s===kt)return this.calculateKeyFromCapo();if(s in this.metadata)return this.metadata[s];let e=this.providers.get(s);return e?e():this.getArrayItem(s)}all(){let s={};this.providers.forEach((a,f)=>{let l=a();l!==null&&(s[f]=l)}),Object.assign(s,this.metadata);let e=this.calculateKeyFromCapo();return e&&(s[kt]=e),s}ownMetadata(){let s={...this.metadata},e=this.calculateKeyFromCapo();return e&&(s[kt]=e),s}[Symbol.iterator](){return Object.entries(this.ownMetadata())[Symbol.iterator]()}getSingle(s){let e=this.get(s);return Array.isArray(e)?e[0]:e}parseArrayKey(s){let e=s.match(/(.+)\.(-?\d+)$/);if(!e)return null;let a=e[1],f=parseInt(e[2],10);return[a,f]}getArrayItem(s){let e=this.parseArrayKey(s);if(e===null)return null;let[a,f]=e,l=this.metadata[a]||[],h=f;return h<0?h=l.length+h:h>0&&(h-=1),l[h]}clone(){let s=new r(this.metadata);return this.providers.forEach((e,a)=>s.setProvider(a,e)),s}calculateKeyFromCapo(){let s=this.getSingle(Jt),e=this.getSingle(Ms);if(s&&e){let a=De.parse(e);if(!a)throw new Error(`Could not parse ${e}`);let f=parseInt(s,10);return a.transpose(f).normalize().toString()}return null}assign(s){Object.keys(s).filter(e=>!wn(e)).forEach(e=>{let a=s[e];a!=null&&(a instanceof Array?this.metadata[e]=[...a]:a===null?delete this.metadata[e]:this.metadata[e]=a.toString())})}},Jr=Zr;function Dn(r,s){let e=[...new Set(r)];return e.length===1?e[0]:s}var Qr=class{addLine(s){this.lines.push(s)}isLiteral(){let{lines:s}=this;return this.isEmpty()?!1:s.every(e=>e.items.every(a=>!!(a instanceof us||a instanceof fe&&a.isSectionDelimiter())))}get contents(){return this.lines.filter(s=>s.items.every(e=>e instanceof us)).map(s=>s.items.map(e=>e.string).join("")).join(`
`)}get label(){if(this.lines.length===0)return null;let s=this.lines[0].items.find(e=>e instanceof fe&&e.isSectionDelimiter());return s?s.label:null}get type(){let s=this.lines.map(e=>e.type);return Dn(s,pc)}get selector(){let s=this.lines.map(e=>e.selector).filter(e=>e!==null);return Dn(s,null)}get selectorIsNegated(){return this.lines.some(s=>s.selectorIsNegated)}hasRenderableItems(){return this.lines.some(s=>s.hasRenderableItems())}isEmpty(){return this.lines.length===0}constructor(){this.lines=[]}},Tn=Qr,ei=class r{constructor(s,e){this.fontSize=s,this.unit=e}clone(){return new r(this.fontSize,this.unit)}multiply(s){return new r(this.fontSize*s/100,this.unit)}toString(){return`${this.fontSize}${this.unit}`}static parse(s,e){let a=s.trim(),f=parseFloat(a);return Number.isNaN(f)?this.parseNotANumber(e):a.slice(-1)==="%"?this.parsePercentage(f,e):new r(f,"px")}static parseNotANumber(s){return s?s.clone():new r(100,"%")}static parsePercentage(s,e){return e?e.multiply(s):new r(s,"%")}},Df=ei,si=class{applyTag(s){switch(s.name){case Ht:this.textFont.font=this.pushOrPopTag(s);break;case Vt:this.textFont.size=this.pushOrPopSizeTag(s);break;case Nr:this.textFont.colour=this.pushOrPopTag(s);break;case Ot:this.chordFont.font=this.pushOrPopTag(s);break;case Wt:this.chordFont.size=this.pushOrPopSizeTag(s);break;case kr:this.chordFont.colour=this.pushOrPopTag(s);break;default:break}}pushOrPopTag(s){let{value:e}=s;return s.hasValue()?this.fontAndColourStacks[s.name].push(e):(this.fontAndColourStacks[s.name].pop(),e=this.fontAndColourStacks[s.name].slice(-1)[0]||null),e}pushOrPopSizeTag(s){let{value:e}=s;if(s.hasValue()){let a=this.sizeStacks[s.name].slice(-1)[0]||null,f=Df.parse(e,a);return this.sizeStacks[s.name].push(f),f}return this.sizeStacks[s.name].pop(),this.sizeStacks[s.name].slice(-1)[0]||null}constructor(){this.fontAndColourStacks={[kr]:[],[Ot]:[],[Nr]:[],[Ht]:[]},this.sizeStacks={[Wt]:[],[Vt]:[]},this.textFont=new Yt,this.chordFont=new Yt}},Tf=si,ti=class{constructor(s,e,a){this.lineNumber=null,this.column=null,this.message=s,this.lineNumber=e,this.column=a}toString(){return`Warning: ${this.message} on line ${this.lineNumber||"?"} column ${this.column||"?"}`}},Mf=ti,ri=class{constructor(s){this.currentKey=null,this.currentLine=null,this.fontStack=new Tf,this.lines=[],this.metadata=new Jr,this.sectionType=Xs,this.selector=null,this.selectorIsNegated=!1,this.transposeKey=null,this.warnings=[],this.song=s,this.song.lines=this.lines,this.song.warnings=this.warnings}get previousLine(){let s=this.lines.length;return s>=2?this.lines[s-2]:null}addLine(s){var e;return s?this.currentLine=s:(this.currentLine=new Ur,this.lines.push(this.currentLine)),this.setCurrentProperties(this.sectionType,this.selector,this.selectorIsNegated),this.currentLine.transposeKey=(e=this.transposeKey)!=null?e:this.currentKey,this.currentLine.key=this.currentKey||this.song.getMetadata().getSingle(Ms),this.currentLine.lineNumber=this.lines.length-1,this.currentLine}setCurrentProperties(s,e=null,a=!1){if(!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.type=s,this.currentLine.selector=e,this.currentLine.selectorIsNegated=a,this.currentLine.textFont=this.fontStack.textFont.clone(),this.currentLine.chordFont=this.fontStack.chordFont.clone()}addItem(s){if(s instanceof fe)this.addTag(s);else{if(this.ensureLine(),!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.addItem(s)}}chords(s){if(!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.chords(s)}lyrics(s){if(this.ensureLine(),!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.lyrics(s)}addTag(s){let e=fe.parseOrFail(s);return this.applyTagOnSong(e),this.applyTagOnLine(e),e}ensureLine(){this.currentLine===null&&this.addLine()}applyTagOnSong(s){s.name===qc?this.transposeKey=s.value:s.name===ua?this.currentKey=s.value:s.isSectionDelimiter()?this.setSectionTypeFromTag(s):s.isInlineFontTag()&&this.fontStack.applyTag(s)}applyTagOnLine(s){if(this.ensureLine(),!this.currentLine)throw new Error("Expected this.currentLine to be present");this.currentLine.addTag(s)}setSectionTypeFromTag(s){let[e,a]=Ir.interpret(s.name,s.value);a&&(e===Js?this.startSection(a,s):e===Qs&&this.endSection(a===In?this.sectionType:a,s))}startSection(s,e){this.checkCurrentSectionType(Xs,e),this.selector=e.selector,this.selectorIsNegated=e.isNegated,s===Zt&&e.value?this.sectionType=e.value.split(" ")[0].toLowerCase():this.sectionType=s,this.setCurrentProperties(s,e.selector,e.isNegated)}endSection(s,e){this.checkCurrentSectionType(s,e),this.sectionType=Xs,this.selector=null,this.selectorIsNegated=!1}checkCurrentSectionType(s,e){this.sectionType!==s&&!(s==="part"&&e.name==="end_of_part")&&this.addWarning(`Unexpected tag {${e.originalName}}, current section is: ${this.sectionType}`,e)}addWarning(s,{line:e,column:a}){let f=new Mf(s,e||null,a||null);this.warnings.push(f)}},Xt=ri,ii=class{constructor(s){this.addedLine=!1,this.song=s,this.clonedSong=new ai,this.builder=new Xt(this.clonedSong)}mapItems(s){return this.song.lines.forEach(e=>{this.mapLineItems(e,s)}),this.clonedSong}mapLineItems(s,e){s.items.forEach(a=>{this.mapItem(e,a)}),s.isEmpty()&&this.ensureLine(),this.addedLine=!1}mapItem(s,e){let a=s(e);if(a===null)return;let f=Array.isArray(a);(!f||a.length>0)&&this.ensureLine(),f?a.forEach(l=>this.builder.addItem(l)):this.builder.addItem(a)}ensureLine(){this.addedLine||(this.builder.addLine(),this.addedLine=!0)}},Gf=ii;function Fr({selector:r,isNegated:s},{configuration:e,metadata:a}){var h,S;if(r===((h=e.instrument)==null?void 0:h.type)||r===((S=e.user)==null?void 0:S.name))return!s;let f=a.getSingle(r),l=f&&f!=="";return s?!l:!!l}function Bf(r){let s=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),a=String(r.getDate()).padStart(2,"0");return`${s}-${e}-${a}`}function ba(){let r=new Map;return r.set("chordpro",()=>"ChordPro"),r.set("chordpro.version",()=>"14.0.0"),r.set("today",()=>Bf(new Date)),r}function jf(r){let s=ba(),{instrument:e,user:a}=r;return s.set("instrument",()=>{var f;return(f=e==null?void 0:e.type)!=null?f:null}),s.set("instrument.type",()=>{var f;return(f=e==null?void 0:e.type)!=null?f:null}),s.set("instrument.description",()=>{var f;return(f=e==null?void 0:e.description)!=null?f:null}),s.set("tuning",()=>{var f;return(f=e==null?void 0:e.tuning)!=null?f:null}),s.set("user",()=>{var f;return(f=a==null?void 0:a.name)!=null?f:null}),s.set("user.name",()=>{var f;return(f=a==null?void 0:a.name)!=null?f:null}),s.set("user.fullname",()=>{var f;return(f=a==null?void 0:a.fullname)!=null?f:null}),s}var ni=class r extends da{constructor(s=null){super(),this.lines=[],this._bodyLines=null,this._bodyParagraphs=null,this._renderParagraphs=null,this.warnings=[],this._metadata=null,s&&(this._metadata=new Jr(s))}get bodyLines(){var s;return(s=this._bodyLines)!=null||(this._bodyLines=this.selectRenderableItems(this.lines)),this._bodyLines}get bodyParagraphs(){var s;return(s=this._bodyParagraphs)!=null||(this._bodyParagraphs=this.selectRenderableItems(this.paragraphs)),this._bodyParagraphs}get renderParagraphs(){var s;return(s=this._renderParagraphs)!=null?s:this.bodyParagraphs}set renderParagraphs(s){this._renderParagraphs=s}selectRenderableItems(s){let e=[...s];for(;e.length&&!e[0].hasRenderableItems();)e.shift();return e}get paragraphs(){return this.linesToParagraphs(this.lines)}get expandedBodyParagraphs(){let s=this.lines.flatMap(e=>Ff.expand(e,this));return this.selectRenderableItems(this.linesToParagraphs(s))}filterParagraphs(s,e){let a={configuration:e,metadata:this.metadata};return s.filter(f=>{let{selector:l,selectorIsNegated:h}=f;return l?Fr({selector:l,isNegated:h},a):!0})}linesToParagraphs(s){let e=new Tn,a=[e];return s.forEach((f,l)=>{let h=s[l+1]||null;f.isEmpty()||f.isSectionEnd()&&h&&!h.isEmpty()?(e=new Tn,a.push(e)):f.hasRenderableItems()&&e.addLine(f)}),a}clone(){let s=new r;return s.warnings=[...this.warnings],s.lines=this.lines.map(e=>e.clone()),s}getMetadataValue(s){return this.metadata.getMetadataValue(s)}getSingleMetadataValue(s){return this.metadata.getSingleMetadataValue(s)}setKey(s){let e=s?s.toString():null;return this.changeMetadata(Ms,e)}setCapo(s){let e=s?s.toString():null;return this.changeMetadata(Jt,e)}updateDirectives(s){let e={...s},a=Tc(e,(l,h)=>h!==null&&!this.metadata.contains(l)),f=this.changeOrDeleteDirectives(e);return f.insertDirectives(a),f}changeOrDeleteDirectives(s){let e={...s};return this.mapItems(a=>{if(!(a instanceof fe))return a;let f=a;if(!(f.name in e&&f.isMetaTag()))return a;let l=e[f.name];return l===null?null:(e[f.name]=null,[l].flat().map(h=>new fe(f.name,h)))})}insertDirectives(s,{after:e=null}={}){let a=this.findInsertIndex(e),f=this.adjustInsertIndex(a),l=this.createMetadataLines(s),h=this.prepareLinesToInsert(l,a,f);this.spliceLines(f,h)}findInsertIndex(s){return this.lines.findIndex(e=>e.items.some(a=>this.isInsertionPoint(a,s)))}isInsertionPoint(s,e){return!(s instanceof fe)||e&&s.name===e?!0:s.isComment()||s.isSectionDelimiter()}adjustInsertIndex(s){if(s<=0)return s;for(let e=s-1;e>=0;e-=1)if(!this.lines[e].isEmpty())return e+1;return 0}createMetadataLines(s){return Object.keys(s).flatMap(e=>[s[e]].flat().map(f=>{let l=new Ur;return l.addTag(e,f),l}))}prepareLinesToInsert(s,e,a){let f=[...s];return!(e>a&&this.lines.slice(a,e).some(h=>h.isEmpty()))&&s.length>0&&f.push(new Ur),f}spliceLines(s,e){let{lines:a}=this;this.lines=[...a.slice(0,s),...e,...a.slice(s)]}transpose(s,{accidental:e=null,normalizeChordSuffix:a=!1}={}){let f=null;return this.mapItems(l=>l instanceof fe&&l.name===Ms?(f=De.wrapOrFail(l.value).transpose(s).normalize(),e&&(f=f.useAccidental(e)),l.set({value:f.toString()})):l instanceof we?r.transposeChordLyricsPair(l,s,f,a,e):l instanceof us&&r.isMusicalSection(l.parentLine)?r.transposeLiteral(l,s,f,a,e):l)}static transposeChordLyricsPair(s,e,a,f,l){let h=s.transpose(e,a,{normalizeChordSuffix:f});return l&&(h=h.useAccidental(l)),h}static transposeLiteral(s,e,a,f,l){return r.mapChordsInLiteral(s,h=>{let S=h.transpose(e);return a&&(S=S.normalize(a,{normalizeSuffix:f})),l&&(S=S.useAccidental(l)),S})}transposeUp({normalizeChordSuffix:s=!1}={}){return this.transpose(1,{normalizeChordSuffix:s})}transposeDown({normalizeChordSuffix:s=!1}={}){return this.transpose(-1,{normalizeChordSuffix:s})}changeKey(s){let e=this.requireCurrentKey(),a=De.wrapOrFail(s),f=e.distanceTo(a);return this.transpose(f,{accidental:a.accidental})}useAccidental(s){let{currentKey:e}=this,a=this.mapChordLyricsPairs(f=>f.useAccidental(s));return e&&e.accidental!==s&&(a=a.changeKey(e.useAccidental(s))),a}useModifier(s){return Je("useModifier is deprecated, use useAccidental instead"),this.useAccidental(s)}normalizeChords(s=null,{normalizeSuffix:e=!0}={}){return this.changeChords(a=>a.normalize(s,{normalizeSuffix:e}))}mapChordLyricsPairs(s){return this.mapItems(e=>e instanceof we?s(e):e)}changeChords(s){return this.mapItems(e=>e instanceof we?e.changeChord(s):e instanceof us&&r.isMusicalSection(e.parentLine)?r.mapChordsInLiteral(e,s):e)}static isMusicalSection(s){return s===null||![gi,mi,hi,di].includes(s.type)}static mapChordsInLiteral(s,e){let a=s.string.replace(/(\s|^)(\S+)(?=\s|$)/g,(f,l,h)=>{let S=nt.parse(h);return S?`${l}${e(S).toString()}`:`${l}${h}`});return new us(a)}get currentKey(){return De.wrap(this.key)}requireCurrentKey(){let{currentKey:s}=this;if(!s)throw new Error(`
Cannot change song key, the original key is unknown.

Either ensure a key directive is present in the song (when using chordpro):
  \`{key: C}\`

Or set the song key before changing key:
  \`song.setKey('C');\``.substring(1));return s}changeMetadata(s,e){if(typeof s=="string"){if(typeof e=="undefined")throw new Error("Value is required when name is a string");return this.changeMetadata({[s]:e})}let a=this.updateDirectives(s);return a.metadata.assign(s),a}addLine(s){this.lines.push(s)}mapItems(s){return new Gf(this).mapItems(s)}foreachItem(s){this.lines.forEach(e=>{e.items.forEach(s)})}getChords(){let s=new Set;return this.foreachItem(e=>{if(!(e instanceof we))return;let a=e.chords;if(a&&a.length>0){let f=nt.parse(a);f&&s.add(f.toString())}}),Array.from(s)}getChordDefinitions(s){let e={};return this.foreachItem(a=>{if(!(a instanceof fe))return;let{chordDefinition:f,selector:l,isNegated:h}=a;l&&s&&!Fr({selector:l,isNegated:h},s)||f&&(e[f.name]=f.clone())}),e}get metadata(){return this._metadata||(this._metadata=this.getMetadata()),this._metadata}getMetadata(s){let e=new Jr;(s?jf(s):ba()).forEach((l,h)=>e.setProvider(h,l));let f=()=>this.getChords();return e.setProvider("chords",()=>{let l=f();return l.length?l.join(", "):null}),e.setProvider("numchords",()=>f().length.toString()),e.setProvider("key_actual",()=>{var l;return(l=e.getSingle("_key"))!=null?l:e.getSingle("key")}),e.setProvider("key_from",()=>e.getSingle("key")),this.foreachItem(l=>{if(!(l instanceof fe))return;let h=l;if(!h.isMetaTag())return;let{selector:S,isNegated:D}=h;S&&s&&!Fr({selector:S,isNegated:D},{metadata:e,configuration:s})||e.add(l.name,l.value)}),e}get chordDefinitions(){return new Lf(this.getChordDefinitions())}mapLines(s){let e=new r,a=new Xt(e);return this.lines.forEach(f=>{let l=s(f);l&&(a.addLine(),l.items.forEach(h=>a.addItem(h)))}),e}updateItem(s,e,a){let f=!1,l=this.mapItems(h=>s(h)?(f=!0,e(h)):h);return f?l:a(l)}removeItem(s){return this.mapLines(e=>{let{items:a}=e,f=a.findIndex(s);return f===-1?e:a.length===1?null:e.set({items:[...a.slice(0,f),...a.slice(f+1)]})})}},ai=ni,Mn="chordLyricsPair",Gn="chordSheet",Bn="comment",jn="line",Pn="softLineBreak",kn="tag",Nn="ternary",oi=class{serialize(s){return{type:Gn,lines:s.lines.map(e=>this.serializeLine(e))}}serializeLine(s){return{type:jn,items:s.items.map(e=>this.serializeItem(e))}}serializeItem(s){let a=new Map([[fe,this.serializeTag.bind(this)],[we,this.serializeChordLyricsPair.bind(this)],[vn,this.serializeTernary.bind(this)],[us,this.serializeLiteral.bind(this)],[tt,this.serializeComment.bind(this)],[Ln,()=>({type:Pn})]]).get(s.constructor);if(!a)throw new Error(`Don't know how to serialize ${s.constructor.name}`);return a(s)}serializeChordDefinition(s){return{name:s.name,baseFret:s.baseFret,frets:s.frets,fingers:s.fingers}}serializeTag(s){let e={type:kn,name:s.originalName,value:s.value,attributes:s.attributes||{}};return s.chordDefinition&&(e.chordDefinition=this.serializeChordDefinition(s.chordDefinition)),e}serializeChordLyricsPair(s){let e={type:Mn,chords:s.chords,chord:null,lyrics:s.lyrics,annotation:s.annotation};return s.isRhythmSymbol&&(e.isRhythmSymbol=!0),e}serializeTernary(s){return{type:Nn,variable:s.variable,valueTest:s.valueTest,trueExpression:this.serializeExpression(s.trueExpression),falseExpression:this.serializeExpression(s.falseExpression)}}serializeLiteral(s){return s.string}serializeExpression(s){return s.map(e=>this.serializeItem(e))}serializeComment(s){return{type:Bn,comment:s.content}}deserialize(s,e={}){var a;return this.notation=(a=e.notation)!=null?a:null,this.parseAstComponent(s),this.song}parseAstComponent(s){if(typeof s=="string")return new us(s);switch(s.type){case Gn:this.parseChordSheet(s);break;case Mn:return this.parseChordLyricsPair(s);case Bn:return this.parseComment(s);case Pn:return new Ln;case kn:return this.parseTag(s);case Nn:return this.parseTernary(s);case jn:this.parseLine(s);break;default:Kn(`Unhandled AST component "${s.type}"`)}return null}parseChordSheet(s){let{lines:e}=s;this.song=new ai,this.songBuilder=new Xt(this.song),e.forEach(a=>this.parseAstComponent(a))}parseLine(s){let{items:e}=s;this.songBuilder.addLine(),e.forEach(a=>{let f=this.parseAstComponent(a);this.songBuilder.addItem(f)})}parseChordLyricsPair(s){let{chord:e,chords:a,lyrics:f,annotation:l,isRhythmSymbol:h}=s,S=e?new nt(e).toString():a,D=this.notation&&S?nt.parse(S,{notation:this.notation}):null;return new we(D?D.toString():S,f,l,D,h||!1)}parseTag(s){let{name:e,value:a,location:{offset:f=null,line:l=null,column:h=null}={},chordDefinition:S,attributes:D,selector:A,isNegated:x}=s,F=new fe(e,a,{line:l,column:h,offset:f},D);return F.selector=A||null,F.isNegated=x||!1,S&&(F.chordDefinition=new Un(S.name,S.baseFret,S.frets,S.fingers)),F}parseComment(s){let{comment:e}=s;return new tt(e)}parseTernary(s){let{variable:e,valueTest:a,trueExpression:f,falseExpression:l,location:{offset:h=null,line:S=null,column:D=null}={}}=s;return new vn({variable:e,valueTest:a,trueExpression:this.parseExpression(f),falseExpression:this.parseExpression(l),offset:h,line:S,column:D})}parseExpression(s){return(s||[]).map(e=>this.parseAstComponent(e)).filter(e=>e!==null)}constructor(){this.song=new ai,this.songBuilder=new Xt(this.song),this.notation=null}},Pf=oi,ci=class{trace(){}},kf=ci;function Nf(r){return r.replace(/\n$/,"").split(`
`)}function Nt(r){return{type:"line",items:r}}function Rf(r,s,e){return[Nt([r]),...Nf(e).map(a=>Nt([a])),Nt([s])]}function vr(r,s,e,a){return{type:"tag",name:r,location:a.start,value:(s==null?void 0:s.value)||"",attributes:(s==null?void 0:s.attributes)||{},selector:e==null?void 0:e.value,isNegated:e==null?void 0:e.isNegated}}function If(r,s,e,a=f=>f){let f=new RegExp(s,"g"),l=Array.from(r.matchAll(f)),h=[],S=0;l.forEach(A=>{let x=r.slice(S,A.index);x!==""&&h.push(a(x)),h.push(e(A[0])),S=A.index+A[0].length});let D=r.slice(S);return D!==""&&h.push(a(D)),h}function pa(r){return If(r,"\xA0",()=>({type:"softLineBreak"}),s=>({type:"chordLyricsPair",chords:"",lyrics:s}))}function _f(r,s){let e=pa(s||""),[a,...f]=e,l=e[0],h=null;return r!==""&&(!l||l.type==="softLineBreak"?h={type:"chordLyricsPair",chords:r,lyrics:""}:l={...l,chords:r}),[h,l||null,...f].filter(S=>S!==null)}function Rn(r){return typeof r!="string"&&r.type==="chordLyricsPair"}function zf(r,s){return Rn(r)&&Rn(s)&&r.chords.length>0&&s.chords.length===0}function Of(r,s){return{...r,lyrics:`${r.lyrics}${s.lyrics}`}}function Wf(r,s){if(s!==!1)return r;let e=[];for(let a=0,{length:f}=r;a<f;a+=1)r[a+1]&&zf(r[a],r[a+1])?(e.push(Of(r[a],r[a+1])),a+=1):e.push(r[a]);return e}function Dr(r,s,e){return e=e||" ",r.length>s?r:(s-=r.length,e+=e.repeat(s),r+e.slice(0,s))}var rt=class r extends Error{static buildMessage(s,e){function a(A){return A.charCodeAt(0).toString(16).toUpperCase()}function f(A){return A.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function l(A){return A.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,x=>"\\x0"+a(x)).replace(/[\x10-\x1F\x7F-\x9F]/g,x=>"\\x"+a(x))}function h(A){switch(A.type){case"literal":return'"'+f(A.text)+'"';case"class":let x=A.parts.map(F=>Array.isArray(F)?l(F[0])+"-"+l(F[1]):l(F));return"["+(A.inverted?"^":"")+x+"]";case"any":return"any character";case"end":return"end of input";case"other":return A.description}}function S(A){let x=A.map(h),F,P;if(x.sort(),x.length>0){for(F=1,P=1;F<x.length;F++)x[F-1]!==x[F]&&(x[P]=x[F],P++);x.length=P}switch(x.length){case 1:return x[0];case 2:return x[0]+" or "+x[1];default:return x.slice(0,-1).join(", ")+", or "+x[x.length-1]}}function D(A){return A?'"'+f(A)+'"':"end of input"}return"Expected "+S(s)+" but "+D(e)+" found."}constructor(s,e,a,f){super(),this.message=s,this.expected=e,this.found=a,this.location=f,this.name="PeggySyntaxError",typeof Object.setPrototypeOf=="function"?Object.setPrototypeOf(this,r.prototype):this.__proto__=r.prototype,typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,r)}format(s){let e="Error: "+this.message;if(this.location){let a=null,f;for(f=0;f<s.length;f++)if(s[f].grammarSource===this.location.source){a=s[f].text.split(/\r\n|\n|\r/g);break}let l=this.location.start,h=this.location.source+":"+l.line+":"+l.column;if(a){let S=this.location.end,D=Dr("",l.line.toString().length," "),A=a[l.line-1],x=l.line===S.line?S.column:A.length+1;e+=`
 --> `+h+`
`+D+` |
`+l.line+" | "+A+`
`+D+" | "+Dr("",l.column-1," ")+Dr("",x-l.column,"^")}else e+=`
 at `+h}return e}};function Hf(r,s){s=s!==void 0?s:{};let e={},a=s.grammarSource,f={ChordSheet:Ji},l=Ji,h=function(t,n){return{type:"chordSheet",lines:[...t,n].flat()}},S=function(t){return t},D=function(t,n,o,c){return Nt([t?{type:"chordLyricsPair",chords:"",lyrics:t}:null,...Wf(n.flat(),s.chopFirstWord),o?{type:"chordLyricsPair",chords:o,lyrics:""}:null,c?{type:"comment",comment:c}:null].filter(g=>g!==null))},A=function(t){return pa(t)},x="#",F=R("#",!1),P=/^[^\r\n]/,j=ue(["\r",`
`],!0,!1),H=function(t){return t},ne=function(t,n,o){return{type:"chordLyricsPair",annotation:t||"",lyrics:n+(o||"")}},Z=function(t,n,o){let c=n.map(g=>g.char||g).join("")+(o||"");return _f(t||"",c)},Y=function(t){return t.map(n=>n.char||n).join("")},V="[*",K=R("[*",!1),re="]",q=R("]",!1),he=function(t){return t.map(n=>n.char||n).join("")},ye="[",Ce=R("[",!1),ce=function(t){return t.map(n=>n.char||n).join("")},Pe=/^[^\]\r\n]/,_=ue(["]","\r",`
`],!0,!1),ie="\\",de=R("\\",!1),ke=function(){return{type:"char",char:"\\"}},Gs=function(){return{type:"char",char:"]"}},Ne=function(t){return t},ss="%{",gs=R("%{",!1),J="}",se=R("}",!1),hs=function(t,n,o){return{type:"ternary",variable:t.length>0?t:null,valueTest:n,...o,location:Fs().start}},ts="=",He=R("=",!1),ds=function(t){return t},Ve="|",Re=R("|",!1),Bs=function(t,n){return{type:"ternary",trueExpression:t,falseExpression:n,location:Fs().start}},js=function(t){return t},Ke=/^[a-zA-Z0-9\-_]/,qe=ue([["a","z"],["A","Z"],["0","9"],"-","_"],!1,!1),v="%",oe=R("%",!1),ee="{",O=R("{",!1),Ue=function(){return{type:"char",char:"%"}},U=function(){return{type:"char",char:"]"}},Ie=function(){return{type:"char",char:"|"}},Ye=function(){return{type:"char",char:"}"}},gt=/^[^|[\]\\{}%#\r\n\t ]/,ht=ue(["|","[","]","\\","{","}","%","#","\r",`
`,"	"," "],!0,!1),bs=function(){return{type:"char",char:"\\"}},be=function(){return{type:"char",char:"["}},pe=function(){return{type:"char",char:"{"}},dt=function(){return{type:"char",char:"#"}},Ps=" ",rs=R(" ",!1),ps=function(){return{type:"char",char:s!=null&&s.softLineBreaks?"\xA0":" "}},Me="chord",Q=R("chord",!1),$s="define",xs=R("define",!1),is=":",ys=R(":",!1),ks=function(t,n,o){let{text:c,...g}=o;return{type:"tag",name:t,value:c,chordDefinition:g,location:Fs().start,selector:n==null?void 0:n.value,isNegated:n==null?void 0:n.isNegated}},Ns=function(t,n,o){return vr(t,o,n,Fs())},Cs="-",Rs=R("-",!1),Is=function(t,n){return{value:t,isNegated:!!n}},_s="!",As=R("!",!1),zs=function(){return!0},Os=function(t){return t},ns=function(t){return{value:t}},Ws=function(t){return{attributes:t}},_e=function(t){let n={};return t.forEach(o=>{n[o[0]]=o[1]}),n},Xe=function(t){return t},Hs=function(t,n){return[t,n]},m=/^[a-zA-Z_]/,W=ue([["a","z"],["A","Z"],"_"],!1,!1),Le=function(t){return t.map(n=>n.char||n).join("")},d=/^[^}\\\r\n]/,C=ue(["}","\\","\r",`
`],!0,!1),L=/^[a-zA-Z\-_]/,B=ue([["a","z"],["A","Z"],"-","_"],!1,!1),le='"',Ae=R('"',!1),$e=function(t){return t},Ti=/^[^"}]/,X=ue(['"',"}"],!0,!1),as=function(){return{type:"char",char:'"'}},fr="frets",lr=R("frets",!1),ur=function(t,n,o,c){return{name:t,baseFret:n||1,frets:o,fingers:c,text:ho()}},bt="/",os=R("/",!1),I=/^[A-Ga-g]/,mr=ue([["A","G"],["a","g"]],!1,!1),pt=/^[b#\u266D\u266F]/,$t=ue(["b","#","\u266D","\u266F"],!1,!1),Fe="es",xt=R("es",!1),yt="s",Ct=R("s",!1),Vs="is",At=R("is",!1),St=/^[a-zA-Z0-9#\u266Fb\u266D()+\-\/\xF8\u0394\u2212]/,Ks=ue([["a","z"],["A","Z"],["0","9"],"#","\u266F","b","\u266D","(",")","+","-","/","\xF8","\u0394","\u2212"],!1,!1),qs="base-fret",Et=R("base-fret",!1),wt=function(t){return t},Us="fingers",Lt=R("fingers",!1),Ft=function(t){return t},Ss=function(t){return t},gr=/^[\-A-Za-z]/,vt=ue(["-",["A","Z"],["a","z"]],!1,!1),u=/^[0-9]/,p=ue([["0","9"]],!1,!1),E=function(t){return parseInt(t,10)},M=function(t){return t},N="0",Pa=R("0",!1),ka=function(){return 0},Mi="-1",Na=R("-1",!1),Ra=/^[NXnx]/,Ia=ue(["N","X","n","x"],!1,!1),Es=function(t,n,o){return Rf(t,o,n)},Gi="start_of_abc",_a=R("start_of_abc",!1),ws=function(t,n,o){return vr(t,o,n,Fs())},Bi="end_of_abc",za=R("end_of_abc",!1),Ls=function(t){return vr(t,null,null,Fs())},ji="start_of_grid",Oa=R("start_of_grid",!1),Pi="sog",Wa=R("sog",!1),ki="end_of_grid",Ha=R("end_of_grid",!1),Ni="eog",Va=R("eog",!1),Ri="start_of_ly",Ka=R("start_of_ly",!1),Ii="end_of_ly",qa=R("end_of_ly",!1),_i="start_of_svg",Ua=R("start_of_svg",!1),zi="end_of_svg",Ya=R("end_of_svg",!1),Oi="start_of_tab",Xa=R("start_of_tab",!1),Wi="sot",Za=R("sot",!1),Hi="end_of_tab",Ja=R("end_of_tab",!1),Vi="eot",Qa=R("eot",!1),Ki="start_of_textblock",eo=R("start_of_textblock",!1),qi="end_of_textblock",so=R("end_of_textblock",!1),to=bo(),ro=Mt("whitespace"),io=Mt("optional whitespace"),no=/^[ \t\n\r]/,ao=ue([" ","	",`
`,"\r"],!1,!1),oo=Mt("space"),Ui=/^[ \t]/,Yi=ue([" ","	"],!1,!1),co=/^[\n\r]/,fo=ue([`
`,"\r"],!1,!1),lo=`
`,uo=R(`
`,!1),mo="\r",go=R("\r",!1),i=0,G=0,Dt=[{line:1,column:1}],Ge=0,hr=[],y=0,Tt;if(s.startRule!==void 0){if(!(s.startRule in f))throw new Error(`Can't start parsing from rule "`+s.startRule+'".');l=f[s.startRule]}function ho(){return r.substring(G,i)}function Fs(){return Ys(G,i)}function Rl(t,n){throw n=n!==void 0?n:Ys(G,i),Zi([Mt(t)],r.substring(G,i),n)}function Il(t,n){throw n=n!==void 0?n:Ys(G,i),$o(t,n)}function R(t,n){return{type:"literal",text:t,ignoreCase:n}}function ue(t,n,o){return{type:"class",parts:t,inverted:n,ignoreCase:o}}function bo(){return{type:"any"}}function po(){return{type:"end"}}function Mt(t){return{type:"other",description:t}}function Xi(t){let n=Dt[t],o;if(n)return n;for(o=t-1;!Dt[o];)o--;for(n=Dt[o],n={line:n.line,column:n.column};o<t;)r.charCodeAt(o)===10?(n.line++,n.column=1):n.column++,o++;return Dt[t]=n,n}function Ys(t,n){let o=Xi(t),c=Xi(n);return{source:a,start:{offset:t,line:o.line,column:o.column},end:{offset:n,line:c.line,column:c.column}}}function w(t){i<Ge||(i>Ge&&(Ge=i,hr=[]),hr.push(t))}function $o(t,n){return new rt(t,[],"",n)}function Zi(t,n,o){return new rt(rt.buildMessage(t,n),t,n,o)}function Ji(){let t,n,o;for(t=i,n=[],o=Qi();o!==e;)n.push(o),o=Qi();return n!==e?(o=en(),o===e&&(o=null),o!==e?(G=t,n=h(n,o),t=n):(i=t,t=e)):(i=t,t=e),t}function Qi(){let t,n,o;return t=i,n=en(),n!==e?(o=ls(),o!==e?(G=t,n=S(n),t=n):(i=t,t=e)):(i=t,t=e),t}function en(){let t;return t=Jo(),t===e&&(t=xo()),t}function xo(){let t,n,o,c,g,b,$;if(t=i,n=i,o=Gt(),o===e&&(o=null),o!==e?n=r.substring(n,i):n=o,n!==e){for(o=[],c=sn();c!==e;)o.push(c),c=sn();if(o!==e)if(c=rn(),c===e&&(c=null),c!==e)if(g=yo(),g===e&&(g=null),g!==e){for(b=[],$=ze();$!==e;)b.push($),$=ze();b!==e?(G=t,n=D(n,o,c,g),t=n):(i=t,t=e)}else i=t,t=e;else i=t,t=e;else i=t,t=e}else i=t,t=e;return t}function sn(){let t,n;return t=Do(),t===e&&(t=To(),t===e&&(t=Co(),t===e&&(t=Ao(),t===e&&(t=dr(),t===e&&(t=i,n=Gt(),n!==e&&(G=t,n=A(n)),t=n))))),t}function yo(){let t,n,o,c,g,b;if(t=i,n=ze(),n===e&&(n=null),n!==e)if(r.charCodeAt(i)===35?(o=x,i++):(o=e,y===0&&w(F)),o!==e){for(c=i,g=[],P.test(r.charAt(i))?(b=r.charAt(i),i++):(b=e,y===0&&w(j));b!==e;)g.push(b),P.test(r.charAt(i))?(b=r.charAt(i),i++):(b=e,y===0&&w(j));g!==e?c=r.substring(c,i):c=g,c!==e?(G=t,n=H(c),t=n):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function Co(){let t,n,o,c,g,b;if(t=i,n=So(),n!==e){for(o=i,c=[],g=Gt();g!==e;)c.push(g),g=Gt();if(c!==e?o=r.substring(o,i):o=c,o!==e){for(c=i,g=[],b=ze();b!==e;)g.push(b),b=ze();g!==e?c=r.substring(c,i):c=g,c!==e?(G=t,n=ne(n,o,c),t=n):(i=t,t=e)}else i=t,t=e}else i=t,t=e;return t}function Ao(){let t,n,o,c,g,b;if(t=i,n=rn(),n!==e){for(o=[],c=br();c!==e;)o.push(c),c=br();if(o!==e){for(c=i,g=[],b=ze();b!==e;)g.push(b),b=ze();g!==e?c=r.substring(c,i):c=g,c!==e?(G=t,n=Z(n,o,c),t=n):(i=t,t=e)}else i=t,t=e}else i=t,t=e;return t}function Gt(){let t,n,o;if(t=i,n=[],o=tn(),o!==e)for(;o!==e;)n.push(o),o=tn();else n=e;return n!==e&&(G=t,n=Y(n)),t=n,t}function tn(){let t;return t=br(),t===e&&(t=ze()),t}function So(){let t,n,o,c,g;if(t=i,n=i,y++,o=Ds(),y--,o===e?n=void 0:(i=n,n=e),n!==e)if(r.substr(i,2)===V?(o=V,i+=2):(o=e,y===0&&w(K)),o!==e){if(c=[],g=Bt(),g!==e)for(;g!==e;)c.push(g),g=Bt();else c=e;c!==e?(r.charCodeAt(i)===93?(g=re,i++):(g=e,y===0&&w(q)),g!==e?(G=t,n=he(c),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function rn(){let t,n,o,c,g;if(t=i,n=i,y++,o=Ds(),y--,o===e?n=void 0:(i=n,n=e),n!==e)if(r.charCodeAt(i)===91?(o=ye,i++):(o=e,y===0&&w(Ce)),o!==e){for(c=[],g=Bt();g!==e;)c.push(g),g=Bt();c!==e?(r.charCodeAt(i)===93?(g=re,i++):(g=e,y===0&&w(q)),g!==e?(G=t,n=ce(c),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function Bt(){let t,n,o,c;return Pe.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&w(_)),t===e&&(t=i,n=Ds(),n!==e?(o=i,r.charCodeAt(i)===92?(c=ie,i++):(c=e,y===0&&w(de)),c!==e&&(G=o,c=ke()),o=c,o===e&&(o=i,r.charCodeAt(i)===93?(c=re,i++):(c=e,y===0&&w(q)),c!==e&&(G=o,c=Gs()),o=c),o!==e?(G=t,n=Ne(o),t=n):(i=t,t=e)):(i=t,t=e)),t}function dr(){let t,n,o,c,g,b,$,T,z;return t=i,r.substr(i,2)===ss?(n=ss,i+=2):(n=e,y===0&&w(gs)),n!==e?(o=k(),o!==e?(c=i,g=vo(),g===e&&(g=null),g!==e?c=r.substring(c,i):c=g,c!==e?(g=Eo(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=Lo(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(z=J,i++):(z=e,y===0&&w(se)),z!==e?(G=t,n=hs(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Eo(){let t,n,o,c;return t=i,r.charCodeAt(i)===61?(n=ts,i++):(n=e,y===0&&w(He)),n!==e?(o=k(),o!==e?(c=wo(),c!==e?(G=t,n=ds(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function wo(){let t,n,o;if(t=i,n=[],o=vs(),o!==e)for(;o!==e;)n.push(o),o=vs();else n=e;return n!==e?t=r.substring(t,i):t=n,t}function Lo(){let t,n,o,c,g,b,$;return t=i,r.charCodeAt(i)===124?(n=Ve,i++):(n=e,y===0&&w(Re)),n!==e?(o=k(),o!==e?(c=nn(),c!==e?(g=k(),g!==e?(b=Fo(),b===e&&(b=null),b!==e?($=k(),$!==e?(G=t,n=Bs(c,b),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Fo(){let t,n,o,c;return t=i,r.charCodeAt(i)===124?(n=Ve,i++):(n=e,y===0&&w(Re)),n!==e?(o=k(),o!==e?(c=nn(),c!==e?(G=t,n=js(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function vo(){let t,n;if(t=[],Ke.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&w(qe)),n!==e)for(;n!==e;)t.push(n),Ke.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&w(qe));else t=e;return t}function nn(){let t,n,o,c;if(t=[],n=i,o=[],c=vs(),c!==e)for(;c!==e;)o.push(c),c=vs();else o=e;if(o!==e?n=r.substring(n,i):n=o,n===e&&(n=dr()),n!==e)for(;n!==e;){if(t.push(n),n=i,o=[],c=vs(),c!==e)for(;c!==e;)o.push(c),c=vs();else o=e;o!==e?n=r.substring(n,i):n=o,n===e&&(n=dr())}else t=e;return t}function br(){let t,n,o,c;return t=an(),t===e&&(t=i,r.charCodeAt(i)===37?(n=v,i++):(n=e,y===0&&w(oe)),n!==e?(o=i,y++,r.charCodeAt(i)===123?(c=ee,i++):(c=e,y===0&&w(O)),y--,c===e?o=void 0:(i=o,o=e),o!==e?(G=t,n=Ue(),t=n):(i=t,t=e)):(i=t,t=e),t===e&&(t=i,r.charCodeAt(i)===93?(n=re,i++):(n=e,y===0&&w(q)),n!==e&&(G=t,n=U()),t=n,t===e&&(t=i,r.charCodeAt(i)===124?(n=Ve,i++):(n=e,y===0&&w(Re)),n!==e&&(G=t,n=Ie()),t=n,t===e&&(t=i,r.charCodeAt(i)===125?(n=J,i++):(n=e,y===0&&w(se)),n!==e&&(G=t,n=Ye()),t=n)))),t}function vs(){let t;return t=an(),t===e&&(t=ze()),t}function an(){let t,n,o,c;return gt.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&w(ht)),t===e&&(t=i,n=Ds(),n!==e?(o=i,r.charCodeAt(i)===92?(c=ie,i++):(c=e,y===0&&w(de)),c!==e&&(G=o,c=bs()),o=c,o===e&&(o=i,r.charCodeAt(i)===124?(c=Ve,i++):(c=e,y===0&&w(Re)),c!==e&&(G=o,c=Ie()),o=c,o===e&&(o=i,r.charCodeAt(i)===91?(c=ye,i++):(c=e,y===0&&w(Ce)),c!==e&&(G=o,c=be()),o=c,o===e&&(o=i,r.charCodeAt(i)===93?(c=re,i++):(c=e,y===0&&w(q)),c!==e&&(G=o,c=U()),o=c,o===e&&(o=i,r.charCodeAt(i)===123?(c=ee,i++):(c=e,y===0&&w(O)),c!==e&&(G=o,c=pe()),o=c,o===e&&(o=i,r.charCodeAt(i)===125?(c=J,i++):(c=e,y===0&&w(se)),c!==e&&(G=o,c=Ye()),o=c,o===e&&(o=i,r.charCodeAt(i)===37?(c=v,i++):(c=e,y===0&&w(oe)),c!==e&&(G=o,c=Ue()),o=c,o===e&&(o=i,r.charCodeAt(i)===35?(c=x,i++):(c=e,y===0&&w(F)),c!==e&&(G=o,c=dt()),o=c,o===e&&(o=i,r.charCodeAt(i)===32?(c=Ps,i++):(c=e,y===0&&w(rs)),c!==e&&(G=o,c=ps()),o=c)))))))),o!==e?(G=t,n=Ne(o),t=n):(i=t,t=e)):(i=t,t=e)),t}function Do(){let t,n,o,c,g,b,$,T,z,dn,Sr;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,5)===Me?(c=Me,i+=5):(c=e,y===0&&w(Q)),c===e&&(r.substr(i,6)===$s?(c=$s,i+=6):(c=e,y===0&&w(xs))),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?(r.charCodeAt(i)===58?($=is,i++):($=e,y===0&&w(ys)),$!==e?(T=k(),T!==e?(z=_o(),z!==e?(dn=k(),dn!==e?(r.charCodeAt(i)===125?(Sr=J,i++):(Sr=e,y===0&&w(se)),Sr!==e?(G=t,n=ks(c,g,z),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function To(){let t,n,o,c,g,b,$,T;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(c=i,g=No(),g!==e?c=r.substring(c,i):c=g,c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=cs(),b===e&&(b=Bo()),b===e&&(b=null),b!==e?($=k(),$!==e?(r.charCodeAt(i)===125?(T=J,i++):(T=e,y===0&&w(se)),T!==e?(G=t,n=Ns(c,g,b),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Ze(){let t,n,o,c;return t=i,r.charCodeAt(i)===45?(n=Cs,i++):(n=e,y===0&&w(Rs)),n!==e?(o=Go(),o!==e?(c=Mo(),c===e&&(c=null),c!==e?(G=t,n=Is(o,c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Mo(){let t,n;return t=i,r.charCodeAt(i)===33?(n=_s,i++):(n=e,y===0&&w(As)),n!==e&&(G=t,n=zs()),t=n,t}function Go(){let t,n,o;if(t=i,n=[],Ke.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(qe)),o!==e)for(;o!==e;)n.push(o),Ke.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(qe));else n=e;return n!==e?t=r.substring(t,i):t=n,t}function cs(){let t,n,o,c;return t=i,n=k(),n!==e?(r.charCodeAt(i)===58?(o=is,i++):(o=e,y===0&&w(ys)),o!==e?(c=jo(),c!==e?(G=t,n=Os(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Bo(){let t,n,o;return t=i,n=fs(),n!==e?(o=cn(),o!==e?(G=t,n=ns(o),t=n):(i=t,t=e)):(i=t,t=e),t}function jo(){let t,n;return t=i,n=Po(),n!==e&&(G=t,n=Ws(n)),t=n,t===e&&(t=i,n=cn(),n!==e&&(G=t,n=ns(n)),t=n),t}function Po(){let t,n,o;if(t=i,n=[],o=on(),o!==e)for(;o!==e;)n.push(o),o=on();else n=e;return n!==e&&(G=t,n=_e(n)),t=n,t}function on(){let t,n,o;return t=i,n=fs(),n!==e?(o=ko(),o!==e?(G=t,n=Xe(o),t=n):(i=t,t=e)):(i=t,t=e),t}function ko(){let t,n,o,c,g,b;return t=i,n=Ro(),n!==e?(o=k(),o!==e?(r.charCodeAt(i)===61?(c=ts,i++):(c=e,y===0&&w(He)),c!==e?(g=k(),g!==e?(b=Io(),b!==e?(G=t,n=Hs(n,b),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function No(){let t,n;if(t=[],m.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&w(W)),n!==e)for(;n!==e;)t.push(n),m.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&w(W));else t=e;return t}function cn(){let t,n,o,c;if(t=i,n=k(),n!==e){for(o=[],c=fn();c!==e;)o.push(c),c=fn();o!==e?(G=t,n=Le(o),t=n):(i=t,t=e)}else i=t,t=e;return t}function fn(){let t,n,o,c;return d.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&w(C)),t===e&&(t=i,n=Ds(),n!==e?(o=i,r.charCodeAt(i)===92?(c=ie,i++):(c=e,y===0&&w(de)),c!==e&&(G=o,c=bs()),o=c,o===e&&(o=i,r.charCodeAt(i)===125?(c=J,i++):(c=e,y===0&&w(se)),c!==e&&(G=o,c=Ye()),o=c,o===e&&(o=i,r.charCodeAt(i)===123?(c=ee,i++):(c=e,y===0&&w(O)),c!==e&&(G=o,c=pe()),o=c)),o!==e?(G=t,n=Ne(o),t=n):(i=t,t=e)):(i=t,t=e)),t}function Ro(){let t,n,o;if(t=i,n=[],L.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(B)),o!==e)for(;o!==e;)n.push(o),L.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(B));else n=e;return n!==e?t=r.substring(t,i):t=n,t}function Io(){let t,n,o,c,g;if(t=i,r.charCodeAt(i)===34?(n=le,i++):(n=e,y===0&&w(Ae)),n!==e){for(o=i,c=[],g=ln();g!==e;)c.push(g),g=ln();c!==e?o=r.substring(o,i):o=c,o!==e?(r.charCodeAt(i)===34?(c=le,i++):(c=e,y===0&&w(Ae)),c!==e?(G=t,n=$e(o),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;return t}function ln(){let t,n,o,c;return Ti.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&w(X)),t===e&&(t=i,n=Ds(),n!==e?(o=i,r.charCodeAt(i)===92?(c=ie,i++):(c=e,y===0&&w(de)),c!==e&&(G=o,c=bs()),o=c,o===e&&(o=i,r.charCodeAt(i)===125?(c=J,i++):(c=e,y===0&&w(se)),c!==e&&(G=o,c=Ye()),o=c,o===e&&(o=i,r.charCodeAt(i)===34?(c=le,i++):(c=e,y===0&&w(Ae)),c!==e&&(G=o,c=as()),o=c)),o!==e?(G=t,n=Ne(o),t=n):(i=t,t=e)):(i=t,t=e)),t}function _o(){let t,n,o,c,g,b,$;if(t=i,n=zo(),n!==e)if(o=k(),o!==e)if(c=Vo(),c===e&&(c=null),c!==e)if(r.substr(i,5)===fr?(g=fr,i+=5):(g=e,y===0&&w(lr)),g!==e){if(b=[],$=gn(),$!==e)for(;$!==e;)b.push($),$=gn();else b=e;b!==e?($=Ko(),$===e&&($=null),$!==e?(G=t,n=ur(n,c,b,$),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;else i=t,t=e;else i=t,t=e;return t}function zo(){let t,n,o,c;return t=i,n=i,o=Oo(),o!==e?(c=Wo(),c===e&&(c=null),c!==e?(o=[o,c],n=o):(i=n,n=e)):(i=n,n=e),n!==e?t=r.substring(t,i):t=n,t}function Oo(){let t,n,o,c;return t=i,n=i,o=un(),o!==e?(c=Ho(),c===e&&(c=null),c!==e?(o=[o,c],n=o):(i=n,n=e)):(i=n,n=e),n!==e?t=r.substring(t,i):t=n,t}function Wo(){let t,n,o,c;return t=i,n=i,r.charCodeAt(i)===47?(o=bt,i++):(o=e,y===0&&w(os)),o!==e?(c=un(),c!==e?(o=[o,c],n=o):(i=n,n=e)):(i=n,n=e),n!==e?t=r.substring(t,i):t=n,t}function un(){let t,n,o,c;return t=i,n=i,I.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(mr)),o!==e?(pt.test(r.charAt(i))?(c=r.charAt(i),i++):(c=e,y===0&&w($t)),c===e&&(r.substr(i,2)===Fe?(c=Fe,i+=2):(c=e,y===0&&w(xt)),c===e&&(r.charCodeAt(i)===115?(c=yt,i++):(c=e,y===0&&w(Ct)),c===e&&(r.substr(i,2)===Vs?(c=Vs,i+=2):(c=e,y===0&&w(At))))),c===e&&(c=null),c!==e?(o=[o,c],n=o):(i=n,n=e)):(i=n,n=e),n!==e?t=r.substring(t,i):t=n,t}function Ho(){let t,n,o;if(t=i,n=[],St.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(Ks)),o!==e)for(;o!==e;)n.push(o),St.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(Ks));else n=e;return n!==e?t=r.substring(t,i):t=n,t}function Vo(){let t,n,o,c,g;return t=i,r.substr(i,9)===qs?(n=qs,i+=9):(n=e,y===0&&w(Et)),n!==e?(o=fs(),o!==e?(c=hn(),c!==e?(g=fs(),g!==e?(G=t,n=wt(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Ko(){let t,n,o,c,g;if(t=i,n=fs(),n!==e)if(r.substr(i,7)===Us?(o=Us,i+=7):(o=e,y===0&&w(Lt)),o!==e){if(c=[],g=mn(),g!==e)for(;g!==e;)c.push(g),g=mn();else c=e;c!==e?(G=t,n=Ft(c),t=n):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function mn(){let t,n,o;return t=i,n=fs(),n!==e?(o=qo(),o!==e?(G=t,n=Ss(o),t=n):(i=t,t=e)):(i=t,t=e),t}function qo(){let t;return t=Uo(),t===e&&(gr.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&w(vt))),t}function Uo(){let t,n;return t=i,u.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&w(p)),n!==e&&(G=t,n=E(n)),t=n,t}function gn(){let t,n,o;return t=i,n=fs(),n!==e?(o=Yo(),o!==e?(G=t,n=M(o),t=n):(i=t,t=e)):(i=t,t=e),t}function Yo(){let t,n,o;return t=i,n=k(),n!==e?(o=hn(),o===e&&(o=Xo(),o===e&&(o=Zo())),o!==e?(G=t,n=M(o),t=n):(i=t,t=e)):(i=t,t=e),t}function hn(){let t,n;return t=i,u.test(r.charAt(i))?(n=r.charAt(i),i++):(n=e,y===0&&w(p)),n!==e&&(G=t,n=E(n)),t=n,t}function Xo(){let t,n;return t=i,r.charCodeAt(i)===48?(n=N,i++):(n=e,y===0&&w(Pa)),n!==e&&(G=t,n=ka()),t=n,t}function Zo(){let t;return r.substr(i,2)===Mi?(t=Mi,i+=2):(t=e,y===0&&w(Na)),t===e&&(Ra.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&w(Ia))),t}function Jo(){let t;return t=Qo(),t===e&&(t=sc(),t===e&&(t=rc(),t===e&&(t=nc(),t===e&&(t=oc(),t===e&&(t=fc()))))),t}function Qo(){let t,n,o,c,g,b,$,T;if(t=i,n=ec(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=pr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=pr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=pr(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function ec(){let t,n,o,c,g,b,$,T,z;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,12)===Gi?(c=Gi,i+=12):(c=e,y===0&&w(_a)),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(z=J,i++):(z=e,y===0&&w(se)),z!==e?(G=t,n=ws(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function pr(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,10)===Bi?(c=Bi,i+=10):(c=e,y===0&&w(za)),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=J,i++):(b=e,y===0&&w(se)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function sc(){let t,n,o,c,g,b,$,T;if(t=i,n=tc(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=$r(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=$r(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=$r(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function tc(){let t,n,o,c,g,b,$,T,z;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,13)===ji?(c=ji,i+=13):(c=e,y===0&&w(Oa)),c===e&&(r.substr(i,3)===Pi?(c=Pi,i+=3):(c=e,y===0&&w(Wa))),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(z=J,i++):(z=e,y===0&&w(se)),z!==e?(G=t,n=ws(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function $r(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,11)===ki?(c=ki,i+=11):(c=e,y===0&&w(Ha)),c===e&&(r.substr(i,3)===Ni?(c=Ni,i+=3):(c=e,y===0&&w(Va))),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=J,i++):(b=e,y===0&&w(se)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function rc(){let t,n,o,c,g,b,$,T;if(t=i,n=ic(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=xr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=xr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=xr(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function ic(){let t,n,o,c,g,b,$,T,z;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,11)===Ri?(c=Ri,i+=11):(c=e,y===0&&w(Ka)),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(z=J,i++):(z=e,y===0&&w(se)),z!==e?(G=t,n=ws(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function xr(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,9)===Ii?(c=Ii,i+=9):(c=e,y===0&&w(qa)),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=J,i++):(b=e,y===0&&w(se)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function nc(){let t,n,o,c,g,b,$,T;if(t=i,n=ac(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=yr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=yr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=yr(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function ac(){let t,n,o,c,g,b,$,T,z;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,12)===_i?(c=_i,i+=12):(c=e,y===0&&w(Ua)),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(z=J,i++):(z=e,y===0&&w(se)),z!==e?(G=t,n=ws(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function yr(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,10)===zi?(c=zi,i+=10):(c=e,y===0&&w(Ya)),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=J,i++):(b=e,y===0&&w(se)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function oc(){let t,n,o,c,g,b,$,T;if(t=i,n=cc(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=Cr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=Cr(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=Cr(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function cc(){let t,n,o,c,g,b,$,T,z;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,12)===Oi?(c=Oi,i+=12):(c=e,y===0&&w(Xa)),c===e&&(r.substr(i,3)===Wi?(c=Wi,i+=3):(c=e,y===0&&w(Za))),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(z=J,i++):(z=e,y===0&&w(se)),z!==e?(G=t,n=ws(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Cr(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,10)===Hi?(c=Hi,i+=10):(c=e,y===0&&w(Ja)),c===e&&(r.substr(i,3)===Vi?(c=Vi,i+=3):(c=e,y===0&&w(Qa))),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=J,i++):(b=e,y===0&&w(se)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function fc(){let t,n,o,c,g,b,$,T;if(t=i,n=lc(),n!==e)if(o=ls(),o!==e){for(c=i,g=[],b=i,$=i,y++,T=Ar(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);b!==e;)g.push(b),b=i,$=i,y++,T=Ar(),y--,T===e?$=void 0:(i=$,$=e),$!==e?(T=Se(),T!==e?($=[$,T],b=$):(i=b,b=e)):(i=b,b=e);g!==e?c=r.substring(c,i):c=g,c!==e?(g=Ar(),g!==e?(G=t,n=Es(n,c,g),t=n):(i=t,t=e)):(i=t,t=e)}else i=t,t=e;else i=t,t=e;return t}function lc(){let t,n,o,c,g,b,$,T,z;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,18)===Ki?(c=Ki,i+=18):(c=e,y===0&&w(eo)),c!==e?(g=Ze(),g===e&&(g=null),g!==e?(b=k(),b!==e?($=cs(),$===e&&($=null),$!==e?(T=k(),T!==e?(r.charCodeAt(i)===125?(z=J,i++):(z=e,y===0&&w(se)),z!==e?(G=t,n=ws(c,g,$),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Ar(){let t,n,o,c,g,b;return t=i,r.charCodeAt(i)===123?(n=ee,i++):(n=e,y===0&&w(O)),n!==e?(o=k(),o!==e?(r.substr(i,16)===qi?(c=qi,i+=16):(c=e,y===0&&w(so)),c!==e?(g=k(),g!==e?(r.charCodeAt(i)===125?(b=J,i++):(b=e,y===0&&w(se)),b!==e?(G=t,n=Ls(c),t=n):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e)):(i=t,t=e),t}function Se(){let t;return r.length>i?(t=r.charAt(i),i++):(t=e,y===0&&w(to)),t}function fs(){let t,n;if(y++,t=[],n=jt(),n!==e)for(;n!==e;)t.push(n),n=jt();else t=e;return y--,t===e&&(n=e,y===0&&w(ro)),t}function k(){let t,n;for(y++,t=[],n=jt();n!==e;)t.push(n),n=jt();return y--,t===e&&(n=e,y===0&&w(io)),t}function jt(){let t;return no.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&w(ao)),t}function ze(){let t,n,o;if(y++,t=i,n=[],Ui.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(Yi)),o!==e)for(;o!==e;)n.push(o),Ui.test(r.charAt(i))?(o=r.charAt(i),i++):(o=e,y===0&&w(Yi));else n=e;return n!==e?t=r.substring(t,i):t=n,y--,t===e&&(n=e,y===0&&w(oo)),t}function ls(){let t;return co.test(r.charAt(i))?(t=r.charAt(i),i++):(t=e,y===0&&w(fo)),t===e&&(t=uc()),t}function uc(){let t,n,o;return t=i,n=gc(),n!==e?(o=mc(),o!==e?(n=[n,o],t=n):(i=t,t=e)):(i=t,t=e),t}function mc(){let t;return r.charCodeAt(i)===10?(t=lo,i++):(t=e,y===0&&w(uo)),t}function gc(){let t;return r.charCodeAt(i)===13?(t=mo,i++):(t=e,y===0&&w(go)),t}function Ds(){let t;return r.charCodeAt(i)===92?(t=ie,i++):(t=e,y===0&&w(de)),t}if(Tt=l(),Tt!==e&&i===r.length)return Tt;throw Tt!==e&&i<r.length&&w(po()),Zi(hr,Ge<r.length?r.charAt(Ge):null,Ge<r.length?Ys(Ge,Ge+1):Ys(Ge,Ge))}var Vf=Hf,fi=class{get warnings(){var s;return((s=this.song)==null?void 0:s.warnings)||[]}parse(s,e){var f;let a=Vf(Lc(s),{tracer:new kf,...e});return this.song=new Pf().deserialize(a,{notation:(f=e==null?void 0:e.notation)!=null?f:null}),this.song}},tr=fi;var it="b|i|u|s|tt|big|small|sub|sup|span|strut|sym",zl=new RegExp(`<(?:\\/(?:${it})>|(?:${it})(?:\\s[^>]*)?\\/?>)`,"g");var Ol=new RegExp(`<(${it})(\\s[^>]*)?\\/>|<(${it})(\\s[^>]*)?>|<\\/(${it})>`,"g");var Wl={[ct]:sr,[Ts]:ut,[ot]:er,[Zt]:at},Hl={[ct]:$i,[Ts]:Qt,[ot]:pi,[Zt]:zt};var je=null;var wi=()=>{var r;return(r=globalThis.__DEV__)!=null?r:!1},rr={debug:(...r)=>{wi()&&console.debug(...r)},info:(...r)=>{wi()&&console.info(...r)},log:(...r)=>{wi()&&console.log(...r)},warn:(...r)=>{var s;console.warn(...r),(s=je==null?void 0:je.warn)==null||s.call(je,...r)},error:(...r)=>{var s;console.error(...r),(s=je==null?void 0:je.error)==null||s.call(je,...r)}};var me={primary:"#253883",secondary:"#95d2f2",accent:"#E15C62",info:"#31AADF",green:"#A3BD31",yellow:"#FCD200",purple:"#9D1E74",text:"#002B81",background:"#ffffff",white:"#ffffff",black:"#000000",border:"#E0E0E0"};var ms={iosBlue:"#007AFF",chordBlue:"#007bff",chordSecondaryText:"#6c757d",accentYellow:"#f4c11e",cantoralHeaderTintLight:"#3d79b9",modalOverlay:"rgba(0, 0, 0, 0.5)"},Li={light:{text:"#212529",title:"#1C1C1E",chord:ms.chordBlue,muted:ms.chordSecondaryText,label:"#5B6270",chorusBar:ms.accentYellow,chorusBg:"rgba(244, 193, 30, 0.07)",filler:"rgba(33, 37, 41, 0.25)"},dark:{text:"#E5E5EA",title:"#F5F5F7",chord:"#64B5F6",muted:"#98989D",label:"#AEAEB2",chorusBar:ms.accentYellow,chorusBg:"rgba(244, 193, 30, 0.08)",filler:"rgba(229, 229, 234, 0.28)"}};var ql={verde:{skin:"#4FA37A",skinDark:"#2E6B4F",outline:"#173A2A",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:"#E2342B",mohawkB:"#F2D43B",iris:"#5B86B5",mouth:"#E2342B"},celeste:{skin:me.info,skinDark:"#1E7FAE",outline:"#0E3A55",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:me.yellow,mohawkB:"#FFFFFF",iris:me.primary,mouth:me.accent},rojo:{skin:me.accent,skinDark:"#A8383E",outline:"#4A1417",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:me.yellow,mohawkB:"#FFFFFF",iris:me.primary,mouth:"#7A1E22"},lima:{skin:me.green,skinDark:"#6F8420",outline:"#2E3A0C",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:me.purple,mohawkB:me.yellow,iris:me.primary,mouth:me.accent},morado:{skin:me.purple,skinDark:"#6A124E",outline:"#2E0822",cap:"#7C7C82",capDark:"#5C5C62",mohawkA:me.yellow,mohawkB:me.secondary,iris:me.secondary,mouth:me.yellow},nocturno:{skin:"#2C2C3E",skinDark:"#16161F",outline:"#0A0A10",cap:"#44445A",capDark:"#30303F",mohawkA:"#5AE08A",mohawkB:"#9DE86B",iris:"#9DE86B",mouth:"#5AE08A"},dorado:{skin:"#E3B341",skinDark:"#B08423",outline:"#4A3508",cap:"#8A6A1E",capDark:"#6B5217",mohawkA:"#FFF3B0",mohawkB:"#FFFFFF",iris:"#6B5217",mouth:"#B08423"},silueta:{skin:"#8E8E93",skinDark:"#8E8E93",outline:"#636366",cap:"#8E8E93",capDark:"#8E8E93",mohawkA:"#8E8E93",mohawkB:"#8E8E93",iris:"#8E8E93",mouth:"#8E8E93"}};var Kf={A:"LA",B:"SI",C:"DO",D:"RE",E:"MI",F:"FA",G:"SOL"};function ir(r,s){if(s==="EN")return r;let e=r.replace(/(^|[\\/|-])([A-G])/g,(f,l,h)=>l+(Kf[h]||h));return/[A-G][#b]?m(?![a-z])/i.test(r)?e.toLowerCase():e}var $a=new Map;function qf(r){if(!r)return r;let s=r[0],e=r.slice(1).replace(/^B/,"b").replace(/M/g,"m");return s+e}function xa(r,s){if(!r)return"";let e=r.toUpperCase();if(!s)return e;let a=`${e}|${s}`,f=$a.get(a);if(f)return f;try{let l=qf(e),S=new tr().parse(`{key: ${l}}
[${l}]`).transpose(s);for(let D of S.lines)for(let A of D.items)if(A instanceof we&&A.chords){let x=A.chords.toUpperCase();return $a.set(a,x),x}}catch(l){rr.warn("transposeKey error",l)}return e}var nr="@@ARR@@";function ya(r){return r.replace(/\{\s*arr\s*:\s*([^}]*)\}/gi,(s,e)=>`{comment: ${nr}${e.trim()}}`)}var ar="@@CHORUS@@",Uf=/revis|pendiente|\bto ?do\b/i,Yf=/^(estribillo|coro|chorus)\b/i,Xf=/^(puente|pre-?estribillo|bridge)\b/i,Zf=/^(intro|instrumental|interludio|final|outro|solo)\b/i,Jf=/^estrofa\s*(\d+)?\s*$/i,Qf=/^(\s*)(\d{1,2})\s*(?:[.)º°ª]|\.-)\s+/;function Ca(r){return r.replace(/^[^\p{L}\p{N}]+/u,"").replace(/[^\p{L}\p{N}).]+$/u,"").trim()}function el(r){return r.replace(/&[a-z]+;|&#\d+;/gi," ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/\(?\s*\b(bis|x\s?\d+)\b\s*\)?/g," ").replace(/[^a-zñ0-9 ]+/g," ").replace(/\s+/g," ").trim()}function sl(r,s){let e=r?r.split(" "):[],a=s?s.split(" "):[];if(e.length===0&&a.length===0)return 1;if(e.length===0||a.length===0)return 0;let f=Array.from({length:a.length+1},(l,h)=>h);for(let l=1;l<=e.length;l++){let h=[l];for(let S=1;S<=a.length;S++)h[S]=Math.min(f[S]+1,h[S-1]+1,f[S-1]+(e[l-1]===a[S-1]?0:1));f=h}return 1-f[a.length]/Math.max(e.length,a.length)}var tl=.8;function or(r){return r.kind!=="lyrics"?"":r.atoms.map(s=>s.segs.map(e=>e.text).join("")).join("")}function rl(r){return el(r.lines.map(or).join(" "))}function il(r){var f;let s=[],e=[],a=()=>{e.length&&s.push({segs:e}),e=[]};for(let{chord:l,text:h}of r)((f=h.match(/[^\s]+\s*|\s+/g))!=null?f:[""]).map(D=>D.replace(/\s+$/,A=>A?" ":"")).forEach((D,A)=>{let x=A===0?l:"";if(/^\s/.test(D)){if(e.length&&!x){e[e.length-1]={...e[e.length-1],text:e[e.length-1].text+D},a();return}a(),e.push({chord:x,text:D}),a();return}e.push({chord:x,text:D}),/\s$/.test(D)&&a()});a();for(let l=0;l<s.length-1;l++){let h=s[l],S=s[l+1],D=h.segs.length===1&&h.segs[0].chord&&h.segs[0].text.trim()==="",A=S.segs.some(x=>x.text.trim()!=="");if(D&&A&&!S.segs[0].chord){if(S.segs[0]={...S.segs[0],chord:h.segs[0].chord},l>0){let x=s[l-1],F=x.segs[x.segs.length-1];x.segs[x.segs.length-1]={...F,text:F.text.replace(/\s*$/," ")}}s.splice(l,1),l--}}for(;s.length&&s[0].segs.every(l=>!l.chord&&l.text.trim()==="");)s.shift();return s}var nl=/^\(?\s*(estribillo|coro)\s*\)?\s*(\(?\s*(bis|x\s?\d+)\s*\)?)?\s*[.:]?$/i;function al(r){return r.some(s=>s.chord)?!1:nl.test(r.map(s=>s.text).join("").trim())}var ol=/^[\s|/\-–·.,()x×\d]*$/i;function cl(r,s){let e=il(r);if(e.length===0)return null;let a=r.map(l=>l.chord).filter(Boolean),f=r.map(l=>l.text).join("").trim();return a.length>0&&ol.test(f)?{kind:"chords",chords:a,note:f,src:s}:{kind:"lyrics",atoms:e,src:s}}function fl(r){return!!r&&typeof r.name=="string"&&!("chords"in r)}function ll(r){return!!r&&typeof r.chords=="string"}var ul=new Set(["comment","c","comment_italic","ci"]);function Fa(r,s){var H,ne,Z;let e=[],a=[],f=!1,l=null,h="",S=null,D=0,A=(Y,V,K)=>(l={kind:Y,label:V,number:null,lines:[],repeatOf:null,breakBefore:D},D=0,h=K,e.push(l),l),x=()=>{l=null,h=""},F=Y=>{let V=Y==="chorus"?"chorus":Y==="bridge"?"bridge":"verse";if(l&&h===Y)return l;if(S){let K=S;S=null;let re=V==="verse"?K.kind:V,q=A(re,K.label,Y);return q.number=K.number,q}return A(V,null,Y)},P=0;for(let Y of r.paragraphs){if(x(),Y.lines.length===0){P++;continue}D=e.length===0?0:P>=1?2:1,P=0;let V=Y.label;for(let K of Y.lines){let re=(H=K.lineNumber)!=null?H:null,q=K.type==="chorus"||K.type==="bridge"?K.type:"verse",he=[];for(let ce of K.items){if(ll(ce)){let ke=ce.annotation?ce.annotation:ce.chords?ir(ce.chords,s.notation):"";he.push({chord:ke,text:(ne=ce.lyrics)!=null?ne:""});continue}if(!fl(ce))continue;let Pe=ce.name.toLowerCase(),_=((Z=ce.value)!=null?Z:"").trim();if(!ul.has(Pe)||!_)continue;if(_.startsWith(nr)){F(q).lines.push({kind:"arr",text:_.slice(nr.length).trim(),src:re});continue}if(_.startsWith(ar)){x();let ke=A("chorus",_.slice(ar.length).trim()||null,"@ref");ke.repeatOf={index:-1,exact:!0,sameChords:!0},x();continue}if(Uf.test(_)){a.push(Ca(_)||_);continue}let ie=Ca(_),de=ie.match(Jf);if(Yf.test(ie)&&ie.length<=24){x(),S={kind:"chorus",label:ie,number:null};continue}if(Xf.test(ie)&&ie.length<=24){x(),S={kind:"bridge",label:ie,number:null};continue}if(de){x(),S={kind:"verse",label:null,number:de[1]?Number(de[1]):null},de[1]&&(f=!0);continue}if(Zf.test(ie)&&!ie.includes(":")){x(),S={kind:"instrumental",label:ie,number:null};continue}F(q).lines.push({kind:"comment",text:_,src:re})}if(he.length===0)continue;if(al(he)){x();let ce=A("chorus",null,"@ref");ce.repeatOf={index:-1,exact:!0,sameChords:!0},x();continue}let ye=cl(he,re);if(!ye)continue;let Ce=F(q);q!=="verse"&&V&&Ce.label===null&&(Ce.label=V),Ce.lines.push(ye)}}S!=null&&S.label&&e.push({kind:"note",label:null,number:null,lines:[{kind:"comment",text:S.label,src:null}],repeatOf:null,breakBefore:1});let j=e.filter(Y=>{var V;return Y.lines.length>0||((V=Y.repeatOf)==null?void 0:V.index)===-1});return $l(j),pl(j),f=xl(j)||f,yl(j),Al(j,f),{sections:j,reviewNotes:a,manualNumbers:f}}var ml=60,gl=70,hl=/[.,;:!?…)»"'”]\s*$/,dl=/^[a-záéíóúüñ]/;function bl(r,s){let e=r.trim().length;return dl.test(s.trim())?e>gl?!0:e>ml&&!hl.test(r):!1}function pl(r){for(let s of r){let e=[];for(let a of s.lines){let f=e[e.length-1];if((f==null?void 0:f.kind)==="lyrics"&&a.kind==="lyrics"&&bl(or(f),or(a))){let l=f.atoms[f.atoms.length-1],h=l.segs[l.segs.length-1];l.segs[l.segs.length-1]={...h,text:h.text.replace(/\s*$/," ")},f.atoms.push(...a.atoms);continue}e.push(a)}s.lines=e}}function $l(r){for(let s of r)s.kind!=="verse"||s.lines.some(a=>a.kind==="lyrics")||(s.kind=s.lines.some(a=>a.kind==="chords")?"instrumental":"note")}function xl(r){var e,a,f;let s=!1;for(let l of r){if(l.kind!=="verse")continue;let h=l.lines.find(F=>F.kind==="lyrics");if(!h||h.kind!=="lyrics"||!h.atoms[0])continue;let S=h.atoms[0].segs.map(F=>F.text).join(""),D=S.match(Qf);if(!D||S.trim().length>D[0].trim().length)continue;let A=(a=(e=h.atoms[0].segs.find(F=>F.chord))==null?void 0:e.chord)!=null?a:"";h.atoms.shift();let x=(f=h.atoms[0])==null?void 0:f.segs[0];A&&x&&!x.chord&&(h.atoms[0].segs[0]={...x,chord:A}),l.number=Number(D[2]),s=!0}return s}function yl(r){var h,S,D,A;let s=r.map(x=>{var F;return((F=x.repeatOf)==null?void 0:F.index)===-1?"":rl(x)}),e=new Map;r.forEach((x,F)=>{var j;x.kind!=="verse"||x.lines.filter(H=>H.kind==="lyrics").length<2||s[F].length<12||e.set(s[F],[...(j=e.get(s[F]))!=null?j:[],F])});for(let x of e.values())if(!(x.length<2))for(let F of x)r[F].kind="chorus",r[F].inferred=!0;let a=r.map(Cl),f=[],l=[];r.forEach((x,F)=>{var H;if(x.kind!=="chorus")return;if(((H=x.repeatOf)==null?void 0:H.index)===-1){l.push(F);return}let P=-1,j=0;for(let ne of f){let Z=s[ne]===s[F]?1:sl(s[ne],s[F]);Z>j&&(P=ne,j=Z)}if(P>=0&&j>=tl){x.repeatOf={index:P,exact:s[P]===s[F],sameChords:a[P]===a[F]};return}f.push(F)});for(let x of l){let F=r[x],P=f.filter(H=>H<x),j=(S=(h=F.label?f.find(H=>r[H].label===F.label):void 0)!=null?h:P[P.length-1])!=null?S:f[0];if(j===void 0){F.repeatOf=null,F.kind="note",F.lines=[{kind:"comment",text:(D=F.label)!=null?D:"Estribillo",src:null}];continue}F.lines=r[j].lines,F.label=(A=F.label)!=null?A:r[j].label,F.repeatOf={index:j,exact:!0,sameChords:!0}}}function Cl(r){return r.lines.map(s=>s.kind==="lyrics"?s.atoms.flatMap(e=>e.segs.map(a=>a.chord)).filter(Boolean).join(" "):s.kind==="chords"?s.chords.join(" "):"").join("|")}function Al(r,s){var f;let e=r.filter(l=>l.kind==="verse");if(e.length<2&&!s){e.forEach(l=>l.number=null);return}let a=0;for(let l of e)l.number=(f=l.number)!=null?f:a+1,a=l.number}var Sl=/^\(?\s*(bis|x\s?\d+|\d+\s?veces)\s*\)?[.,;:]?\s*$/i;function El(r,s=""){let e=r.segs.map(l=>l.text).join(""),a=Sl.test(e)?"w bis":"w",f=r.segs.map((l,h)=>{let S=h<r.segs.length-1?" m":"",D=l.chord?`<b class="c">${l.chord}</b>`:"",A=/^\s+$/.test(l.text)?l.text.replace(/\s/g,"&#160;"):l.text;return`<span class="s${S}">${D}<span class="t">${A}</span></span>`}).join("");return`<span class="${a}">${s}${f}</span>`}function Aa(r,s,e){let a=e&&r.src!==null?` data-line="${r.src}"`:"";switch(r.kind){case"lyrics":{let f=r.atoms.some(h=>h.segs.some(S=>S.chord)),l=r.atoms.map((h,S)=>El(h,S===0&&s!==null?`<span class="vn">${s}</span>`:"")).join("");return`<div class="ln ly${f?"":" nc"}"${a}>${l}</div>`}case"chords":{let f=r.chords.map(h=>`<b class="c">${h}</b>`).join(""),l=r.note?`<span class="cn">${r.note}</span>`:"";return`<div class="ln co"${a}>${f}${l}</div>`}case"comment":return`<div class="cm"${a}>${r.text}</div>`;case"arr":{let f=/^\s*\|/.test(r.text)?r.text:`| ${r.text}`;return`<div class="arrangement"${a}>${f}</div>`}}}var Sa={verse:"Estrofa",chorus:"Estribillo",bridge:"Puente",instrumental:"Instrumental",note:""};function Fi(r,s){let e=r.kind==="verse"?r.number:null;return r.lines.map(a=>{if(a.kind==="lyrics"&&e!==null){let f=e;return e=null,Aa(a,f,s)}return Aa(a,null,s)}).join("")}function wl(r){let s=r.lines.find(e=>e.kind==="lyrics");return s?or(s).trim():""}function va(r,{lineNumbers:s=!1}={}){var l,h,S,D;let e=[],a=0,{sections:f}=r;for(;a<f.length;){let A=f[a],x=A.kind+(A.inferred?" inferred":"")+(A.breakBefore===2?" gap2":A.breakBefore===0?" gap0":""),F=(l=A.label)!=null?l:A.kind==="chorus"||A.kind==="bridge"?Sa[A.kind]:null;if(A.repeatOf){let j=1;for(;a+j<f.length&&((h=f[a+j].repeatOf)==null?void 0:h.index)===A.repeatOf.index&&((S=f[a+j].repeatOf)==null?void 0:S.exact)===A.repeatOf.exact&&((D=f[a+j].repeatOf)==null?void 0:D.sameChords)===A.repeatOf.sameChords;)j++;let H=F?`<div class="lbl">${F}</div>`:"",ne=f.slice(a,a+j).map(K=>`<div class="rep-one">${H}${Fi(K,s)}</div>`).join(""),Z=wl(A),V=`<details class="rep-fold"><summary><span class="lbl">${(F!=null?F:Sa[A.kind])+(j>1?` <span class="x">\xD7${j}</span>`:"")+(A.repeatOf.exact?A.repeatOf.sameChords?"":' <span class="x xc">otros acordes</span>':' <span class="x">con cambios</span>')}</span>`+(Z?`<span class="pv">${Z}</span>`:"")+`</summary>${Fi(A,s)}</details>`;e.push(`<section class="sec ${x} rep"><div class="rep-full">${ne}</div>${V}</section>`),a+=j;continue}let P=F&&A.kind!=="verse"?`<div class="lbl">${F}</div>`:"";e.push(`<section class="sec ${x}">${P}${Fi(A,s)}</section>`),a++}return`<div class="sheet">${e.join("")}</div>`}function Ll(r){var s,e;switch(r.kind){case"verse":return r.number!==null?{label:String(r.number),name:`Estrofa ${r.number}`,instrumental:!1}:{label:"Estrofa",name:"Estrofa",instrumental:!1};case"chorus":return{label:"E",name:"Estribillo",instrumental:!1};case"bridge":return{label:"P",name:(s=r.label)!=null?s:"Puente",instrumental:!1};case"instrumental":{let a=((e=r.label)!=null?e:"").split(/\s+/)[0].toLowerCase(),f=a?a.charAt(0).toUpperCase()+a.slice(1):"Instrumental";return{label:f,name:f,instrumental:!0}}case"note":return null}}function Ea(r,{instrumentals:s=!0}={}){let e=[];for(let a of r.sections){let f=Ll(a);if(!f||f.instrumental&&!s)continue;let l=e[e.length-1];l&&l.label===f.label?l.times++:e.push({...f,times:1})}return e}function wa(r){return r.length>=3&&r.some(s=>s.label==="E"||s.label==="P")}function La(r){return r.map(s=>s.label+(s.times>1?`\xD7${s.times}`:"")).join(" \xB7 ")}function vi(r,s){let e=r.map(f=>f.name+(f.times>1?` (${f.times} veces)`:"")).join(", "),a=r.map(f=>`<span class="mp${f.label==="E"?" mp-e":""}">${f.label}`+(f.times>1?`<span class="mx">\xD7${f.times}</span>`:"")+"</span>").join("");return`<div class="song-map ${s}" role="img" aria-label="Orden de la canci\xF3n: ${e}">${a}</div>`}function Da(r){let s=Ea(r);if(!wa(s))return"";let e=Ea(r,{instrumentals:!1});return La(e)===La(s)?vi(s,"mp-all"):vi(s,"mp-all has-alt")+(wa(e)?vi(e,"mp-lyr"):"")}var Di=[{id:"negrita",name:"Negrita"},{id:"raya",name:"Raya"},{id:"mayus",name:"MAY\xDAS"},{id:"clasico",name:"Cl\xE1sico"},{id:"sangrado",name:"Sangrado"}],Ta=Di.map(r=>`ch-${r.id}`),Qe=Li.light,es=Li.dark,Ma=`
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
  /* Mapa de la canci\xF3n (\xAB1 \xB7 E \xB7 2 \xB7 E\xD72\xBB), una l\xEDnea discreta encima de
     la letra. Apagado de serie: lo enciende \`show-map\` en el body. */
  .song-map {
    display: none;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.15em 0.45em;
    margin: 0 0 0.6em;
    color: var(--sh-muted);
    font-size: calc(var(--song-font-size) * 0.8);
    font-weight: 600;
    line-height: 1.35;
    font-variant-numeric: tabular-nums;
  }
  body.show-map .song-map.mp-all { display: flex; }
  body.show-map.chords-hidden .song-map.has-alt { display: none; }
  body.show-map.chords-hidden .song-map.mp-lyr { display: flex; }
  .song-map .mp + .mp::before {
    content: '\\00b7';
    margin-right: 0.45em;
    font-weight: 400;
    opacity: 0.7;
  }
  .song-map .mp-e { color: var(--sh-label); }
  .song-map .mx { font-weight: 500; font-size: 0.85em; }
  /* Columnas (iPad, solo si la canci\xF3n cabe entera sin scroll). */
  body.cols { padding-left: 28px; padding-right: 28px; }
  @media (min-width: 720px) {
    body.paged { padding-left: 28px; padding-right: 28px; }
  }
  body.cols .sheet .sec.chorus { margin-left: 0; }
`,Ga=`
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

  // \xBFTiene sentido avisar de girar? Solo en tablet: un m\xF3vil en horizontal
  // tiene sitio para muy pocas l\xEDneas, y un monitor no se gira (sin pantalla
  // t\xE1ctil, nada de aviso; el admin del cantoral lo fuerza con
  // __SONG_ROTATE_HINT__ en su vista de iPad).
  function canRotate(w, h, touchPoints, forced) {
    if (Math.min(w, h) < 600) return false;
    return touchPoints > 0 || !!forced;
  }

  /**
   * \xBFCabr\xEDa entera girando la pantalla? Se maqueta con el ancho y el alto
   * cambiados, se mira y se deshace.
   */
  function fitsRotated(sheet) {
    var w = window.innerWidth, h = window.innerHeight;
    var touch = typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0;
    if (!canRotate(w, h, touch, window.__SONG_ROTATE_HINT__)) return false;
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
    canRotate: canRotate,
    chooseBreaks: chooseBreaks,
    penalty: penalty
  };

  if (typeof document === 'undefined' || !document.addEventListener) return;
  window.addEventListener('resize', schedule);
  // Pasar de canci\xF3n: lo decide quien pinta la hoja (la pantalla completa
  // escucha \xABsheet-nav\xBB; el resto lo ignora). Se avisa al pasar de la \xFAltima
  // p\xE1gina o de la primera, y al deslizar en horizontal con scroll.
  function postNav(dir) {
    var msg = JSON.stringify({ type: 'sheet-nav', dir: dir });
    try {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(msg);
      } else if (window.parent && window.parent !== window) {
        window.parent.postMessage(msg, '*');
      }
    } catch (e) {}
  }
  function pageOrNav(dir) {
    if (!goPage(dir)) postNav(dir);
  }
  // Atril: un toque en el tercio izquierdo vuelve atr\xE1s, en el resto
  // avanza; las flechas, AvP\xE1g/ReP\xE1g, espacio e Intro hacen lo mismo (es lo
  // que mandan los pedales Bluetooth); y tambi\xE9n se puede deslizar.
  document.addEventListener('click', function (e) {
    if (!document.body.classList.contains('paged')) return;
    if (e.target && e.target.closest && e.target.closest('summary, a, button')) return;
    pageOrNav(e.clientX < window.innerWidth / 3 ? -1 : 1);
  });
  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (!document.body.classList.contains('paged')) {
      // Con scroll, las flechas laterales pasan de canci\xF3n.
      if (k === 'ArrowRight' || k === 'ArrowLeft') postNav(k === 'ArrowRight' ? 1 : -1);
      return;
    }
    var d = k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter' ? 1
      : k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    pageOrNav(d);
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
      var dir = dx < 0 ? 1 : -1;
      if (document.body.classList.contains('paged')) pageOrNav(dir);
      else if (Math.abs(dx) > 80) postNav(dir);
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
`;var Fl={hasRepeats:!1,hasVerseNumbers:!1,hasChorus:!1,hasSongMap:!1},mt=new Map,vl=64;function Dl(r){var f,l,h;let s=mt.get(r);if(s!==void 0)return s;let e=ya(r).replace(/\{sov\}/gi,"{start_of_verse}").replace(/\{eov\}/gi,"{end_of_verse}").replace(/\{soc\}/gi,"{start_of_chorus}").replace(/\{eoc\}/gi,"{end_of_chorus}").replace(/\{sob\}/gi,"{start_of_bridge}").replace(/\{eob\}/gi,"{end_of_bridge}").replace(/\{\s*chorus\s*(?::\s*([^}]*))?\}/gi,(S,D)=>`{comment: ${ar}${(D!=null?D:"").trim()}}`).replace(/\{transpose:.*\}/gi,""),a;try{a={song:new tr().parse(We(e)),error:null}}catch(S){rr.error("Error parseando ChordPro en useSongProcessor:",S);let D=(f=S==null?void 0:S.location)==null?void 0:f.start,A=typeof(D==null?void 0:D.line)=="number"&&D.line>0?D.line:null,x=typeof(D==null?void 0:D.column)=="number"&&D.column>0?D.column:null,F=null,P=[];if(A!==null){let j=e.split(/\r?\n/);F=(l=j[A-1])!=null?l:null;let H=Math.max(1,A-1),ne=Math.min(j.length,A+1);for(let Z=H;Z<=ne;Z++)P.push({n:Z,text:(h=j[Z-1])!=null?h:"",isError:Z===A})}a={song:null,error:{message:typeof(S==null?void 0:S.message)=="string"?S.message:String(S),line:A,column:x,lineText:F,context:P}}}if(mt.size>=vl){let S=mt.keys().next().value;S!==void 0&&mt.delete(S)}return mt.set(r,a),a}var We=r=>r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Tl(r,s,e){var re;let a=s?"#1F1F21":"#FBF7F6",f=s?"#2C2C2E":"#FFFFFF",l=s?"rgba(255,255,255,0.06)":"rgba(225,92,98,0.10)",h=s?"0 18px 50px rgba(0,0,0,0.45)":"0 18px 50px rgba(225,92,98,0.12)",S=s?"#F2F2F4":"#1F2430",D=s?"#9A9AA0":"#9A8F8F",A=s?"#FF8A80":"#E15C62",x=s?"#FFB3AC":"#EE7E83",F=s?"rgba(255,138,128,0.22)":"rgba(225,92,98,0.16)",P=s?"rgba(255,138,128,0.08)":"rgba(225,92,98,0.05)",j=s?"rgba(255,138,128,0.24)":"rgba(225,92,98,0.18)",H=s?"#E8E8EC":"#43484F",ne=(r==null?void 0:r.line)!=null?`<div class="err-line-label">\u{1F4CD} L\xEDnea ${r.line}${r.column!=null?` \xB7 col. ${r.column}`:""}</div>`:"",Z=(re=r==null?void 0:r.context)!=null?re:[],Y=Z.length>0?Z.map(q=>`<div class="err-row${q.isError?" is-error":""}"><span class="err-gutter">${q.n}</span><span class="err-line">${We(q.text)||" "}</span></div>`).join(""):(r==null?void 0:r.lineText)!=null&&r.lineText.trim()!==""?`<div class="err-row is-error"><span class="err-line">${We(r.lineText)}</span></div>`:"",V=Y?`<div class="err-codecard">
        <div class="err-codecard-bar"><span></span><span></span><span></span></div>
        <div class="err-code">${Y}</div>
      </div>`:"",K=r!=null&&r.message&&r.message.trim()!==""?`<div class="err-hint"><span class="err-hint-tag">Pista</span>${We(r.message.trim())}</div>`:"";return`<!DOCTYPE html><html><head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <style>
      * { box-sizing: border-box; }
      html, body { height: 100%; margin: 0; }
      body {
        font-family: ${e};
        background:
          radial-gradient(120% 60% at 50% -10%, ${F} 0%, transparent 55%),
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
          radial-gradient(circle at 50% 38%, ${F} 0%, transparent 70%);
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
        color: ${H};
      }
      .err-row {
        display: flex;
        align-items: baseline;
        padding: 1px 14px 1px 0;
      }
      .err-row.is-error {
        background: ${F};
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
      ${ne}
      ${V}
      ${K}
      <p class="err-foot">Hemos avisado a la gente maja que mantiene el cantoral para arreglarlo</p>
    </div>
  </body></html>`}var Ml=r=>({bodyBg:r?"#2C2C2E":"#ffffff",bodyText:r?"#E5E5EA":"#212529",titleText:r?"#F5F5F7":"#1C1C1E",authorText:r?"#98989D":"#8E8E93",chordColor:r?"#64B5F6":ms.chordBlue,commentText:r?"#98989D":ms.chordSecondaryText,badgeBg:r?"rgba(244, 193, 30, 0.12)":"rgba(37, 56, 131, 0.06)",badgeText:r?"#F4C11E":"#253883",badgeAccentBg:r?"rgba(225, 92, 98, 0.15)":"rgba(225, 92, 98, 0.08)",badgeAccentText:r?"#FF8A80":"#C62828",fsBgTop:r?"rgba(44,44,46,0.97)":"rgba(255,255,255,0.97)",fsBgMid:r?"rgba(44,44,46,0.88)":"rgba(255,255,255,0.88)"}),Gl=r=>[r.isDark&&"theme-dark",!r.chordsVisible&&"chords-hidden",!r.arrangementsVisible&&"arr-hidden",r.compact&&"compact",!r.verseNumbers&&"nums-hidden",`ch-${r.chorusStyle}`,!r.chorusLabel&&"ch-nolabel",r.airy&&"airy",r.paged&&"paged",r.songMap&&"show-map"].filter(Boolean).join(" "),Bl=`
(function () {
  var last = 0;
  function post() {
    var now = Date.now();
    if (now - last < 400) return;
    last = now;
    var msg = JSON.stringify({ type: 'sheet-touch' });
    try {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) window.ReactNativeWebView.postMessage(msg);
      else if (window.parent && window.parent !== window) window.parent.postMessage(msg, '*');
    } catch (e) {}
  }
  document.addEventListener('touchstart', post, { passive: true });
  document.addEventListener('mousedown', post);
  document.addEventListener('mousemove', post);
  document.addEventListener('keydown', post);
  window.addEventListener('wheel', post, { passive: true });
})();
`;function jl(r,s){let{currentTranspose:e,notation:a,title:f,author:l,key:h,capo:S,isFullscreen:D=!1,adminMode:A=!1}=s,x=s.style,F=Ml(x.isDark),P=e!==0?r.transpose(e):r,j=Fa(P,{notation:a}),H=Da(j),ne={hasRepeats:j.sections.some(_=>_.repeatOf!==null),hasVerseNumbers:j.sections.some(_=>_.number!==null),hasChorus:j.sections.some(_=>_.kind==="chorus"),hasSongMap:H!==""},Z=va(j,{lineNumbers:A}),Y=P.title||We(f!=null?f:""),V="";l&&!D&&(V+=`<div class="song-meta-author">${We(l)}</div>`);let K=h?e!==0?xa(h,e):h.toUpperCase():"",re=We(ir(K,a)),q="";if(K&&(q+=`<span class="meta-badge">${re}</span>`),S!==void 0&&S>0&&(q+=`<span class="meta-badge">Cejilla ${S}</span>`),j.reviewNotes.length>0&&(q+='<span class="meta-badge meta-badge-muted">Acordes sin revisar</span>'),e!==0){let _=e>0?`+${e}`:`${e}`;q+=`<span class="meta-badge meta-badge-accent">${_} semitonos</span>`}q&&!D&&(V+=`<div class="song-meta-keycapo">${q}</div>`);let he="";if(D){let _="";if(l&&(_+=`<span class="fs-author">${We(l)}</span>`),K&&(_&&(_+='<span class="fs-sep">\xB7</span>'),_+=`<span class="fs-badge-sm">${re}</span>`),S!==void 0&&S>0&&(_+=`<span class="fs-badge-sm">Cejilla ${S}</span>`),e!==0){let ie=e>0?`+${e}`:`${e}`;_+=`<span class="fs-badge-sm fs-badge-accent">${ie} semitonos</span>`}he=`<div class="fs-header">${f?`<div class="fs-title">${We(f)}</div>`:""}${_?`<div class="fs-meta">${_}</div>`:""}</div>`}let ye=(Y?`<h1>${Y}</h1>`:"")+V+H+`<div class="rot-hint" hidden></div><div class="pager">${Z}</div>`,Ce=`
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
          ${JSON.stringify(Ta)}.forEach(function (c) {
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
        if (typeof s.songMap === 'boolean') {
          document.body.classList.toggle('show-map', s.songMap);
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
          background-color: ${F.bodyBg};
          color: ${F.bodyText};
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
        /* Dentro de la hoja el tama\xF1o ya es el de la letra: el calc de arriba
           se aplicaba dos veces y, con la letra grande o en pantalla
           completa, \xABIntro: Viol\xEDn\xBB sal\xEDa m\xE1s grande que la propia letra. */
        .sheet .arrangement { font-size: 0.78em; }
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
        ${Ma}
        ${D?`
        .fs-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: ${Math.max(x.topPadding-48,8)}px 60px 16px 16px;
          background: linear-gradient(to bottom,
            ${F.fsBgTop} 0%,
            ${F.fsBgMid} 72%,
            transparent 100%
          );
          z-index: 10;
          pointer-events: none;
        }
        .fs-title {
          font-size: 0.9em;
          font-weight: 700;
          color: ${F.titleText};
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
          color: ${F.authorText};
          font-style: italic;
        }
        .fs-sep {
          font-size: 0.65em;
          color: ${F.authorText};
          opacity: 0.45;
          margin: 0 1px;
        }
        .fs-badge-sm {
          font-size: 0.65em;
          font-weight: 600;
          color: ${F.badgeText};
          background: ${F.badgeBg};
          padding: 1px 6px;
          border-radius: 8px;
          letter-spacing: 0.01em;
        }
        .fs-badge-accent {
          color: ${F.badgeAccentText};
          background: ${F.badgeAccentBg};
        }`:""}
      </style>
    </head>
    <body class="${Gl(x)}">
      ${he}
      ${ye}
      <script>${Ga}<\/script>
      <script>${Ce}<\/script>
      ${D?`<script>${Bl}<\/script>`:""}
    </body>
    </html>
  `,sheetInfo:ne}}function Ba(r,s){let{song:e,error:a}=Dl(r);return e?{...jl(e,s),error:null}:{html:Tl(a,s.style.isDark,s.style.fontFamily),sheetInfo:Fl,error:a}}var cr=[{name:"Sistema",cssValue:"-apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"},{name:"Monoespaciada",cssValue:"'Roboto Mono', 'Courier New', monospace"},{name:"Serif",cssValue:"'Palatino Linotype', 'Book Antiqua', Palatino, serif"}],b1=cr[0].cssValue;var ja={notation:"ES",chordsVisible:!0,compact:!1,verseNumbers:!0,chorusStyle:"negrita",chorusLabel:!0,airy:!1,songMap:!1,fontSize:1.25,fontFamily:cr[0].cssValue};function kl(r,s={}){var f,l,h,S,D,A,x,F,P,j,H;let e=ja,a={fontSize:(f=s.fontSize)!=null?f:e.fontSize,fontFamily:(l=s.fontFamily)!=null?l:e.fontFamily,isDark:!!s.dark,chordsVisible:(h=s.chordsVisible)!=null?h:e.chordsVisible,arrangementsVisible:!0,compact:(S=s.compact)!=null?S:e.compact,verseNumbers:(D=s.verseNumbers)!=null?D:e.verseNumbers,chorusStyle:(A=s.chorusStyle)!=null?A:e.chorusStyle,chorusLabel:(x=s.chorusLabel)!=null?x:e.chorusLabel,airy:(F=s.airy)!=null?F:e.airy,paged:!1,songMap:(P=s.songMap)!=null?P:e.songMap,topPadding:16,bottomPadding:40};return Ba(r,{style:a,currentTranspose:(j=s.transpose)!=null?j:0,notation:(H=s.notation)!=null?H:e.notation,title:s.title,author:s.author,key:s.key,capo:s.capo,adminMode:!!s.lineNumbers})}var Nl={render:kl,defaults:ja,fonts:cr,chorusStyles:Di};globalThis.MCMSheet=Nl;})();
