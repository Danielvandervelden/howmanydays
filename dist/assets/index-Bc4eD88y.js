(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))c(d);new MutationObserver(d=>{for(const f of d)if(f.type==="childList")for(const g of f.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&c(g)}).observe(document,{childList:!0,subtree:!0});function l(d){const f={};return d.integrity&&(f.integrity=d.integrity),d.referrerPolicy&&(f.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?f.credentials="include":d.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function c(d){if(d.ep)return;d.ep=!0;const f=l(d);fetch(d.href,f)}})();function se(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var N={exports:{}},ae=N.exports,G;function ue(){return G||(G=1,function(r,i){(function(l,c){r.exports=c()})(ae,function(){var l=1e3,c=6e4,d=36e5,f="millisecond",g="second",T="minute",E="hour",I="day",V="week",b="month",J="quarter",w="year",O="date",Z="Invalid Date",ne=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,re=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,ie={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(s){var n=["th","st","nd","rd"],e=s%100;return"["+s+(n[(e-20)%10]||n[e]||n[0])+"]"}},P=function(s,n,e){var o=String(s);return!o||o.length>=n?s:""+Array(n+1-o.length).join(e)+s},oe={s:P,z:function(s){var n=-s.utcOffset(),e=Math.abs(n),o=Math.floor(e/60),t=e%60;return(n<=0?"+":"-")+P(o,2,"0")+":"+P(t,2,"0")},m:function s(n,e){if(n.date()<e.date())return-s(e,n);var o=12*(e.year()-n.year())+(e.month()-n.month()),t=n.clone().add(o,b),a=e-t<0,u=n.clone().add(o+(a?-1:1),b);return+(-(o+(e-t)/(a?t-u:u-t))||0)},a:function(s){return s<0?Math.ceil(s)||0:Math.floor(s)},p:function(s){return{M:b,y:w,w:V,d:I,D:O,h:E,m:T,s:g,ms:f,Q:J}[s]||String(s||"").toLowerCase().replace(/s$/,"")},u:function(s){return s===void 0}},x="en",A={};A[x]=ie;var z="$isDayjsObject",F=function(s){return s instanceof R||!(!s||!s[z])},j=function s(n,e,o){var t;if(!n)return x;if(typeof n=="string"){var a=n.toLowerCase();A[a]&&(t=a),e&&(A[a]=e,t=a);var u=n.split("-");if(!t&&u.length>1)return s(u[0])}else{var m=n.name;A[m]=n,t=m}return!o&&t&&(x=t),t||!o&&x},$=function(s,n){if(F(s))return s.clone();var e=typeof n=="object"?n:{};return e.date=s,e.args=arguments,new R(e)},h=oe;h.l=j,h.i=F,h.w=function(s,n){return $(s,{locale:n.$L,utc:n.$u,x:n.$x,$offset:n.$offset})};var R=function(){function s(e){this.$L=j(e.locale,null,!0),this.parse(e),this.$x=this.$x||e.x||{},this[z]=!0}var n=s.prototype;return n.parse=function(e){this.$d=function(o){var t=o.date,a=o.utc;if(t===null)return new Date(NaN);if(h.u(t))return new Date;if(t instanceof Date)return new Date(t);if(typeof t=="string"&&!/Z$/i.test(t)){var u=t.match(ne);if(u){var m=u[2]-1||0,p=(u[7]||"0").substring(0,3);return a?new Date(Date.UTC(u[1],m,u[3]||1,u[4]||0,u[5]||0,u[6]||0,p)):new Date(u[1],m,u[3]||1,u[4]||0,u[5]||0,u[6]||0,p)}}return new Date(t)}(e),this.init()},n.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},n.$utils=function(){return h},n.isValid=function(){return this.$d.toString()!==Z},n.isSame=function(e,o){var t=$(e);return this.startOf(o)<=t&&t<=this.endOf(o)},n.isAfter=function(e,o){return $(e)<this.startOf(o)},n.isBefore=function(e,o){return this.endOf(o)<$(e)},n.$g=function(e,o,t){return h.u(e)?this[o]:this.set(t,e)},n.unix=function(){return Math.floor(this.valueOf()/1e3)},n.valueOf=function(){return this.$d.getTime()},n.startOf=function(e,o){var t=this,a=!!h.u(o)||o,u=h.p(e),m=function(H,D){var k=h.w(t.$u?Date.UTC(t.$y,D,H):new Date(t.$y,D,H),t);return a?k:k.endOf(I)},p=function(H,D){return h.w(t.toDate()[H].apply(t.toDate("s"),(a?[0,0,0,0]:[23,59,59,999]).slice(D)),t)},v=this.$W,y=this.$M,L=this.$D,q="set"+(this.$u?"UTC":"");switch(u){case w:return a?m(1,0):m(31,11);case b:return a?m(1,y):m(0,y+1);case V:var C=this.$locale().weekStart||0,Y=(v<C?v+7:v)-C;return m(a?L-Y:L+(6-Y),y);case I:case O:return p(q+"Hours",0);case E:return p(q+"Minutes",1);case T:return p(q+"Seconds",2);case g:return p(q+"Milliseconds",3);default:return this.clone()}},n.endOf=function(e){return this.startOf(e,!1)},n.$set=function(e,o){var t,a=h.p(e),u="set"+(this.$u?"UTC":""),m=(t={},t[I]=u+"Date",t[O]=u+"Date",t[b]=u+"Month",t[w]=u+"FullYear",t[E]=u+"Hours",t[T]=u+"Minutes",t[g]=u+"Seconds",t[f]=u+"Milliseconds",t)[a],p=a===I?this.$D+(o-this.$W):o;if(a===b||a===w){var v=this.clone().set(O,1);v.$d[m](p),v.init(),this.$d=v.set(O,Math.min(this.$D,v.daysInMonth())).$d}else m&&this.$d[m](p);return this.init(),this},n.set=function(e,o){return this.clone().$set(e,o)},n.get=function(e){return this[h.p(e)]()},n.add=function(e,o){var t,a=this;e=Number(e);var u=h.p(o),m=function(y){var L=$(a);return h.w(L.date(L.date()+Math.round(y*e)),a)};if(u===b)return this.set(b,this.$M+e);if(u===w)return this.set(w,this.$y+e);if(u===I)return m(1);if(u===V)return m(7);var p=(t={},t[T]=c,t[E]=d,t[g]=l,t)[u]||1,v=this.$d.getTime()+e*p;return h.w(v,this)},n.subtract=function(e,o){return this.add(-1*e,o)},n.format=function(e){var o=this,t=this.$locale();if(!this.isValid())return t.invalidDate||Z;var a=e||"YYYY-MM-DDTHH:mm:ssZ",u=h.z(this),m=this.$H,p=this.$m,v=this.$M,y=t.weekdays,L=t.months,q=t.meridiem,C=function(D,k,B,W){return D&&(D[k]||D(o,a))||B[k].slice(0,W)},Y=function(D){return h.s(m%12||12,D,"0")},H=q||function(D,k,B){var W=D<12?"AM":"PM";return B?W.toLowerCase():W};return a.replace(re,function(D,k){return k||function(B){switch(B){case"YY":return String(o.$y).slice(-2);case"YYYY":return h.s(o.$y,4,"0");case"M":return v+1;case"MM":return h.s(v+1,2,"0");case"MMM":return C(t.monthsShort,v,L,3);case"MMMM":return C(L,v);case"D":return o.$D;case"DD":return h.s(o.$D,2,"0");case"d":return String(o.$W);case"dd":return C(t.weekdaysMin,o.$W,y,2);case"ddd":return C(t.weekdaysShort,o.$W,y,3);case"dddd":return y[o.$W];case"H":return String(m);case"HH":return h.s(m,2,"0");case"h":return Y(1);case"hh":return Y(2);case"a":return H(m,p,!0);case"A":return H(m,p,!1);case"m":return String(p);case"mm":return h.s(p,2,"0");case"s":return String(o.$s);case"ss":return h.s(o.$s,2,"0");case"SSS":return h.s(o.$ms,3,"0");case"Z":return u}return null}(D)||u.replace(":","")})},n.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},n.diff=function(e,o,t){var a,u=this,m=h.p(o),p=$(e),v=(p.utcOffset()-this.utcOffset())*c,y=this-p,L=function(){return h.m(u,p)};switch(m){case w:a=L()/12;break;case b:a=L();break;case J:a=L()/3;break;case V:a=(y-v)/6048e5;break;case I:a=(y-v)/864e5;break;case E:a=y/d;break;case T:a=y/c;break;case g:a=y/l;break;default:a=y}return t?a:h.a(a)},n.daysInMonth=function(){return this.endOf(b).$D},n.$locale=function(){return A[this.$L]},n.locale=function(e,o){if(!e)return this.$L;var t=this.clone(),a=j(e,o,!0);return a&&(t.$L=a),t},n.clone=function(){return h.w(this.$d,this)},n.toDate=function(){return new Date(this.valueOf())},n.toJSON=function(){return this.isValid()?this.toISOString():null},n.toISOString=function(){return this.$d.toISOString()},n.toString=function(){return this.$d.toUTCString()},s}(),K=R.prototype;return $.prototype=K,[["$ms",f],["$s",g],["$m",T],["$H",E],["$W",I],["$M",b],["$y",w],["$D",O]].forEach(function(s){K[s[1]]=function(n){return this.$g(n,s[0],s[1])}}),$.extend=function(s,n){return s.$i||(s(n,R,$),s.$i=!0),$},$.locale=j,$.isDayjs=F,$.unix=function(s){return $(1e3*s)},$.en=A[x],$.Ls=A,$.p={},$})}(N)),N.exports}var ce=ue();const S=se(ce);function le(){const{currentDateInputWrapper:r,currentDateInput:i}=M();if(!r||!i||!(i instanceof HTMLInputElement)){console.error("Couldn't find the current date inputs");return}return r&&!r.classList.contains("hidden")}function M(){const r=document.getElementById("current-date-wrapper"),i=document.getElementById("current-date"),l=document.getElementById("target-date"),c=Array.from(document.querySelectorAll(".date-radio")),d=Array.from(document.querySelectorAll(".verb-radio")),f=document.getElementById("result"),g=document.getElementById("error"),T=Array.from(document.querySelectorAll(".quick-action-button")),E=Array.from(document.querySelectorAll(".qc-verb-text")),I=Array.from(document.querySelectorAll(".quick-action-toggle"));return{currentDateInputWrapper:r,currentDateInput:i,targetDateInput:l,dateRadios:c,verbRadios:d,resultDiv:f,errorDiv:g,quickActionButtons:T,quickActionToggles:I,quickActionVerbs:E}}function Q(r){const{errorDiv:i}=M();if(!i){console.error("Couldn't find the error div");return}if(!r){i.innerText="";return}i.innerText=r}function U(r){const{resultDiv:i}=M();if(!i){console.error("Couldn't find the result div");return}if(!r){i.innerText="";return}i.innerText=r}function de(){const{resultDiv:r,errorDiv:i}=M();if(!r||!i){console.error("Couldn't find the result or error div");return}U(!1),Q(!1)}function te(r){const{verbRadios:i}=M();r>0?i.find(l=>{if(!(l instanceof HTMLInputElement)){console.error("Radio is not an instance of HTMLInputElement");return}l.value==="until"&&(l.checked=!0)}):i.find(l=>{if(!(l instanceof HTMLInputElement)){console.error("Radio is not an instance of HTMLInputElement");return}l.value==="since"&&(l.checked=!0)})}const X=()=>{const{quickActionVerbs:r,quickActionToggles:i}=M(),l=fe();if(!i.length){console.error("Couldn't find the quick action toggles");return}r.forEach((c,d)=>{if(!(c instanceof HTMLSpanElement)){console.error("Verb is not an instance of HTMLSpanElement");return}c.textContent=l??""})};function fe(){const{quickActionToggles:r}=M();if(!r.length){console.error("Couldn't find the quick action toggles");return}const i=Array.from(r).find(c=>{if(!(c instanceof HTMLInputElement)){console.error("Toggle is not an instance of HTMLInputElement");return}return c.checked});if(!i){console.error("No toggle is checked");return}const l=i==null?void 0:i.nextElementSibling;if(!(l instanceof HTMLLabelElement)){console.error("Label element is not an instance of HTMLLabelElement");return}return l.textContent}const he=()=>{const{currentDateInput:r,targetDateInput:i,dateRadios:l,verbRadios:c}=M();if(!i||!r){console.error("Couldn't find the date inputs");return}if(!l.length){console.error("Couldn't find the date radio's for whatever reason. Did we change the HTML?");return}if(!c.length){console.error("Couldn't find the verb radio's for whatever reason. Did we change the HTML?");return}i.addEventListener("change",_),r.addEventListener("change",_),l.forEach(d=>{d.addEventListener("change",_)}),c.forEach(d=>{d.addEventListener("change",_)})},me=()=>{const{quickActionButtons:r,quickActionToggles:i,quickActionVerbs:l}=M();if(!r.length){console.error("Couldn't find the quick action buttons");return}if(!i.length){console.error("Couldn't find the quick action toggles");return}if(!l.length){console.error("Couldn't find the quick action verbs");return}X(),i.forEach(c=>{c.addEventListener("change",X)}),r.forEach(c=>{c.addEventListener("click",()=>{c instanceof HTMLButtonElement&&$e(c)})})},_=()=>{de();const r=le(),{resultDiv:i,verbRadios:l}=M();if(!i){console.error("Couldn't find the result div");return}if(!l.length){console.error("Couldn't find the verb radios");return}if(r){pe();return}ge()};function ge(){const{targetDateInput:r}=M();if(!r||!(r instanceof HTMLInputElement)){console.error("Couldn't find the target date input or it's not an input element");return}const i=S(r.value),l=S(),c=Math.ceil(i.diff(l,"day",!0)),d=c>0?"to go":"ago";U(`${Math.abs(c)} days ${d}`),te(c)}function pe(){const{currentDateInput:r,targetDateInput:i,verbRadios:l}=M();if(!(r instanceof HTMLInputElement)){console.error("currentDateInput is not an instance of HTMLInputElement");return}if(r.value.length||Q('Please enter a valid date in the "other" date field'),!i||!(i instanceof HTMLInputElement)){console.error("Couldn't find the target date input or it's not an input element");return}const c=S(i.value),d=S(r.value);if(!d.isValid()){Q('Please enter a valid date in the "other" date field');return}const f=Math.ceil(c.diff(d,"day",!0)),g=f>0?"to go":"ago";U(`${Math.abs(f)} days ${g}`),te(f)}const $e=r=>{const{targetDateInput:i,quickActionToggles:l,resultDiv:c}=M();if(!i||!(i instanceof HTMLInputElement)){console.error("Couldn't find the target date input");return}const d=l.find(f=>f instanceof HTMLInputElement?f.checked:!1);if(!(d instanceof HTMLInputElement)){console.error("Couldn't find the active quick action verb");return}if(d.value==="until-qc"){const f=r.getAttribute("data-date"),g=S(),T=S(`${g.year()}-${f}`);g.isAfter(T)?i.value=`${g.year()+1}-${f}`:i.value=`${g.year()}-${f}`}else{const f=r.getAttribute("data-date"),g=S(),T=S(`${g.year()}-${f}`);g.isBefore(T)?i.value=`${g.year()-1}-${f}`:i.value=`${g.year()}-${f}`}_(),c==null||c.scrollIntoView({behavior:"smooth"})};_();function ve(){const r=Array.from(document.querySelectorAll(".date-radio"));if(!r.length){console.error("Couldn't find the date radio's for whatever reason. Did we change the HTML?");return}r.forEach(i=>{i.addEventListener("change",l=>{const c=l.target;if(!(c instanceof HTMLInputElement)){console.error("Event target is not an input element");return}ye(c.value==="other")})})}function ye(r){const i=document.getElementById("current-date-wrapper");if(!i){console.error("Couldn't find the current date wrapper");return}r?i.classList.remove("hidden"):i.classList.add("hidden")}function ee(){const r=document.getElementById("date");r&&(r.innerHTML=S().format("DD MMM YYYY HH:mm:ss"))}function De(){ee(),setInterval(ee,1e3),ve(),he(),me()}document.addEventListener("DOMContentLoaded",De);
//# sourceMappingURL=index-Bc4eD88y.js.map