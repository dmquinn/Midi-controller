console.clear();
let countOsc = 0;
let countPrefs = 0;
let oscTypes = ["sine", "square", "sawtooth", "triangle"];
let prefixes = ["fm", "am", "fat"];
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
const filter = new Tone.Filter().toDestination();
filter.frequency.value = 500;

const dist = new Tone.Distortion(0.0).toDestination();
console.log(dist.distortion);

let mode;
mode = "arpeggio";
console.log("mode", mode);
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

		/////////////////////////////////////////////////////////////

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
		console.log("ok", i);
		for (i = 0; i < squaresound.length; i++) {
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
