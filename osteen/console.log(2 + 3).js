
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>

console.log(2 + 3)
const d2 = new Date(2020, 0, 1)
console.log("hello", d2)
const d1 = new Date(2020, 1, 1)
console.log(d1)
const d = new Date(2020, 0, 1)
d.setDate(31)
console.log(d)
var date = new Date();
moment(date); // same as calling moment() with no args


console.log(date)

let now = new Date();
 
var dateString = moment(now).format('YYYY-MM-DD');
console.log(dateString) // Output: 2020-07-21
 
var dateStringWithTime = moment(now).format('YYYY-MM-DD HH:MM:SS');
console.log(dateStringWithTime) // Output: 2020-07-21 07:24:06