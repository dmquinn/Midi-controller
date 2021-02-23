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
};

const filter = new Tone.Filter().toDestination();
const reverb = new Tone.Reverb(0.5).connect(filter);
const synth = new Tone.PolySynth(Tone.FMSynth).connect(reverb);
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

	for (
		var input = allInputs.next();
		input && !input.done;
		input = allInputs.next()
	) {
		input.value.onmidimessage = playNote;
	}
}

function playNote(messageData) {
	console.log(messageData.data[1]);
	i = messageData.data[1];
	synth.triggerAttackRelease(Object.values([notes[i]]), 0.2);
	console.log("ok", Object.keys(notes[i]));
}

function onMIDIFailure() {
	console.warn("Not recognising MIDI controller");
}

//////////HOVERBOARD/////////////

const container = document.getElementById("container");
const colors = ["#e9e9e9", "#f1bfbf", "#e99393", "#e65050", "#e63030"];
const SQUARES = 19;

for (let i = 0; i < SQUARES; i++) {
	i = messageData.data[1];
	console.log("sq", i);
	const square = document.createElement("div");
	square.classList.add("square");

	square.addEventListener("mouseover", () => setColor(square));

	square.addEventListener("mouseout", () => removeColor(square));

	container.appendChild(square);
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
