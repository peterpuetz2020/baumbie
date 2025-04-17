// src/lib/types.ts

export interface ChatButton {
	label: string;
	request: any;
}

export interface Message {
	text: string;
	label: string;
	type: string;
	sender: 'bot' | 'user';
	source?: string;
	clickable?: boolean;
	ai?: boolean;
	buttons?: ChatButton[];
}

export interface RawMessage {
	type: string;
	payload: {
		message?: string;
		type?: string;
		buttons?: { name: string; request: any }[];
	};
}