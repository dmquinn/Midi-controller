console.clear();
var notes = {
	0: "C3",
	1: "C#3",
	2: "D3",
	3: "D#3",
	4: "E3",
	5: "F3",
	6: "F#3",
	7: "G3",
	8: "G#3",
	9: "A3",
	10: "A#3",
	11: "B3",
	12: "C4",
	13: "C4",
	14: "C#4",
	15: "D4",
	16: "D#4",
	17: "E4",
	18: "F4",
	19: "F#4",
	20: "G4",
	21: "G#4",
	24: "A4",
	23: "A#4",
	24: "B4",
	25: "C5",
	26: "C#5",
	27: "D5",
	28: "D#5",
	29: "E5",
	30: "F5",
	31: "F#5",
	32: "G5",
	33: "G#5",
	34: "A5",
	56: "C1",
	57: "E2",
	58: "F2",
};
const container = document.getElementById("container");
const colors = ["#1d1d1d", "#1d1d1d", "#1d1d1d", "#e65050", "#e63030"];
const SQUARES = 300;

const reverb = new Tone.Reverb().toDestination();
const filter = new Tone.Filter().connect(reverb);
// const delay = new Tone.PingPongDelay().connect(reverb).toDestination();
var synth = new Tone.PolySynth(Tone.Synth, {
	oscillator: {
		type: "fatsquare",
		count: 9,
		spread: 20,
	},
	envelope: {
		attack: 10,
		decay: 0.1,
		sustain: 0.5,
		release: 0.9,
		attackCurve: "exponential",
	},
}).connect(reverb);

const squaresound = [];
var midi, data;
if (navigator.requestMIDIAccess) {
	navigator
		.requestMIDIAccess({
			sysex: false,
		})
		.then(onMIDISuccess, onMIDIFailure);
} else {
	console.warn("No MIDI support in your browser");
}

function onMIDISuccess(midiData) {
	midi = midiData;
	var allInputs = midi.inputs.values();
	console.log(midi.outputs);

	for (
		var input = allInputs.next();
		input && !input.done;
		input = allInputs.next()
	) {
		if (!input) {
			removeColor;
		}
		input.value.onmidimessage = playNote;
	}
}

function onMIDIFailure() {
	console.warn("Not recognising MIDI controller");
}

for (let i = 0; i < SQUARES; i++) {
	const square = document.createElement("div");
	square.classList.add("square");
	container.appendChild(square);
	squaresound.push(square);
	console.log("squaresound", squaresound);
}
function playNote(messageData) {
	console.log(messageData.data[1]);
	i = messageData.data[1];

	synth.triggerAttackRelease(Object.values([notes[i]]), 1);

	// squaresound;

	console.log("ok", i);
	for (i = 0; i < squaresound.length; i++) {
		setColor(squaresound[i]);
	}
}

function setColor(element) {
	const color = getRandomColor();
	element.style.background = color;
	element.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`;
}

function removeColor(element) {
	element.style.background = "#1d1d1d";
	element.style.boxShadow = "0 0 2px #000";
}

function getRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)];
}

function onDeviceInput({ input, value }) {
	if (input === 82) changeSynth();
	else if (input === 2) inst.handleVolume(value);
	else if (input === 14) inst.handleFilter(value);
	else console.log("onDeviceInput!", input, value);
}

function changeSynth() {
	synth.oscillator.type = "sine";
	console.log("changed");
}
