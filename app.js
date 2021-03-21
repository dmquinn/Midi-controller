console.clear();
let countOsc = 0;
let countPrefs = 0;
let j = 0;
let sequence = [];
let oscTypes = ["sine", "square", "sawtooth", "triangle"];
let prefixes = ["fm", "am", "fat"];
var notes = {
	0: "C2",
	1: "D#2",
	2: "F2",
	3: "F#2",
	4: "G2",
	5: "C#3",
	6: "F#2",
	7: "G2",
	8: "G#2",
	9: "A2",
	10: "A#2",
	11: "B2",
	12: "C3",
	13: "C#3",
	14: "D3",
	15: "D#3",
	16: "E3",
	17: "F3",
	18: "F#3",
	19: "G3",
	20: "G#3",
	21: "A3",
	22: "A#3",
	23: "B3",
	24: "C4",
	25: "C4",
	26: "C#4",
	27: "D4",
	28: "D#4",
	29: "E4",
	30: "F4",
	31: "F#4",
	32: "G4",
	33: "G#4",
	34: "A4",
	35: "A#4",
	36: "B4",
	37: "C5",
	38: "C#5",
	39: "D5",
	40: "D#5",
	41: "E5",
	42: "F5",
	43: "F#5",
	44: "G5",
	45: "G#5",
	46: "A5",
	47: "C1",
	48: "E2",
	49: "F2",
};
const filter = new Tone.Filter().toDestination();
filter.frequency.value = 500;

const dist = new Tone.Distortion(0.0).toDestination();
console.log(dist.distortion);

let releaseVal = 0.1;
let attackVal = 0.1;

let synthText = document.querySelector(".synthType");
synthText.innerHTML = oscTypes[countOsc].toString();
let prefixText = document.querySelector(".prefixType");
prefixText.innerHTML = prefixes[countPrefs].toString();
let filterText = document.querySelector(".filterText");
filterText.innerHTML = filter.frequency.value;
let distText = document.querySelector(".distText");
distText.innerHTML = dist.distortion;

const container = document.getElementById("container");
const sineColors = ["#1d1d1d", "#1d1d1d", "#1d1d1d", "#e65050", "#e63030"];
const SQUARES = 64;

let synth = new Tone.PolySynth().connect(dist);
synth.set({
	oscillator: { type: prefixes[countPrefs] + oscTypes[countOsc] },
	envelope: {
		attack: 0.005,
		release: releaseVal,
	},
});
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
	console.log(input);

	for (
		var input = allInputs.next();
		input && !input.done;
		input = allInputs.next()
	) {
		if (!input) {
			removeColor(square);
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
}
function playNote(messageData) {
	i = messageData.data[1];
	if (messageData.data[0] === 128) {
		return removeColor;
	}
	if (messageData.data[0] === 144) {
		synth.triggerAttackRelease(Object.values([notes[i]]), 0.2);
		const text = i.toString();
		console.log("text", text);
		focused[j].value = text;

		console.log("140", focused[j].value);

		if (i === 82) {
			changeSynth();
			if (countOsc <= 2) {
				countOsc++;
			} else {
				countOsc = 0;
			}
		}
		if (i === 83) {
			changePrefix();
			if (countPrefs <= 1) {
				countPrefs++;
			} else {
				countPrefs = 0;
			}
		}
		if (i === 64) {
			filterUp();
		}
		if (i === 65) {
			filterDown();
		}
		if (i === 66) {
			distUp();
		}
		if (i === 67) {
			distDown();
		}
		if (i === 84) {
			releaseUp();
		}
		if (i === 85) {
			releaseDown();
		}
		if (i === 86) {
			attackUp();
		}
		if (i === 87) {
			attackDown();
		}
		if (i === 98) {
			focusMethod();
		}

		for (i = 0; i < squaresound.length; i++) {
			setColor(squaresound[i]);
		}
		for (i = 0; i < sequence.length; i++) {
			setColor(squaresound[i]);
		}
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
	return sineColors[Math.floor(Math.random() * sineColors.length)];
}

function changeSynth() {
	synth.set({
		oscillator: { type: prefixes[countPrefs] + oscTypes[countOsc] },
	});
	synthText.innerHTML = oscTypes[countOsc].toString();

	console.log("changed", synth, oscTypes[countOsc]);
}
function changePrefix() {
	synth.set({
		oscillator: { type: prefixes[countPrefs] + oscTypes[countOsc] },
	});
	prefixText.innerHTML = prefixes[countPrefs].toString();

	console.log("changed2", prefixes[countPrefs]);
}
function filterUp() {
	filter.frequency.value = filter.frequency.value + 100;
	filterText.innerHTML = filter.frequency.value;
}
function filterDown() {
	filter.frequency.value = filter.frequency.value - 100;
	filterText.innerHTML = filter.frequency.value;
}
function distUp() {
	dist.distortion = dist.distortion + 0.05;
	distText.innerHTML = dist.distortion;
}
function distDown() {
	dist.distortion = dist.distortion - 0.05;
	distText.innerHTML = dist.distortion;
}
function releaseUp() {
	synth.set({
		envelope: { release: releaseVal++ },
	});
	console.log(synth.options.envelope.release);
}
function releaseDown() {
	synth.set({
		envelope: { release: releaseVal-- },
	});
	console.log(synth.options.envelope.release);
}
function attackUp() {
	synth.set({
		envelope: { attack: attackVal++ },
	});
	console.log(synth.options.envelope.attack);
}
function attackDown() {
	synth.set({
		envelope: { attack: attackVal-- },
	});
	console.log(synth.options.envelope.attack);
}

let focused = document.querySelectorAll("input[type=text]");

function focusMethod() {
	console.log("j", i);
	if (j < focused.length) {
		focused[j].focus();
		focused[j].classList.add("litUp");
		sequence.push(i);

		j++;

		if (j > 7) {
			j = 0;
		}
	}
}
