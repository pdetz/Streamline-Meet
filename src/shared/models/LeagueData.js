const STROKES = [
    {abbr:"", name:"Choose a Stroke", hy3:"X", sd3: '0', relay: false, color: '#888'},
    {abbr:"FR", name:"Freestyle", hy3:"A", sd3: '1', relay: false, color: '#44f'},
    {abbr:"BK", name:"Backstroke", hy3:"B", sd3: '2', relay: false, color: '#4f4'},
    {abbr:"BR", name:"Breaststroke", hy3:"C", sd3: '3', relay: false, color: '#ff4'},
    {abbr:"FL", name:"Butterfly", hy3:"D", sd3: '4', relay: false, color: '#f44'},
    {abbr:"IM", name:"Individual Medley", hy3:"E", sd3: '5', relay: false, color: '#f4f'},
    {abbr:"FRL", name:"Freestyle Relay", hy3:"A", sd3: '6', relay: true, color: '#88f'},
    {abbr:"MRL", name:"Medley Relay", hy3:"E", sd3: '7', relay: true, color: '#f8f'}
];

const GENDERS = { M: "Boys", F: "Girls", X: "Mixed" };

const SWIM_UP_RULES = {
    None: 'No swim-ups are allowed. Swimmers must participate in their own age group.',
    Strict: 'Swim-ups are allowed, but swimmers can only participate in a single age group for the duration of the meet.',
    Unlimited: 'Swimmers can participate in multiple age groups.'
};

/*
const AGEDATE = "06012024";
const WEEKS = ['06082024', '06152024', '06242023', '07012023', '07082023', '07152023', '07222023'];
const CURRENT_WEEK = 1;
const COURSE = "S";
*/

export { STROKES, GENDERS, SWIM_UP_RULES };//, AGEDATE, CURRENT_WEEK, WEEKS, COURSE };