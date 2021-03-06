import { Injectable, Injector } from '@angular/core';
import swal from 'sweetalert2';
import { Utils } from './utils.service';

export interface AlertParams {
	title?: string;
	text: string;
	type?: 'warning' | 'error' | 'success' | 'info' | 'question';
	confirmButtonText?: string;
	cancelButtonText?: string;
	onConfirm?: Function;
	onCancel?: Function;
	onClose?: Function;
}

@Injectable()
export class AlertHelper {

	private utils: Utils;
	private queue: AlertParams[] = [];

	constructor(private injector: Injector) {
		const $this = this;
		setTimeout(() => {
			$this.utils = $this.injector.get(Utils);
		});
	}

	public push(payload: AlertParams) {
		let isNew: Boolean = true;
		this.queue.forEach(function (_payload) {
			if (_payload.text === payload.text) {
				isNew = false;
			}
		});

		if (isNew) {
			this.queue.push(payload);
		}

		this.processNext();
	}

	private processNext() {
		// If queue has element and if sweet alert isn't currently being displayed
		if (swal.isVisible()) {
			// Do Nothing. Sweet Alert is already visible
		} else if (this.queue.length > 0) {
			this.show(this.queue[0]);
		}
	}

	private show(payload: AlertParams) {
		this.utils.showLoadingIndicator(false);
		const $this = this;

		swal({
			title: payload.title || 'Alert',
			text: payload.text,
			type: payload.type || 'info',
			showConfirmButton: true,
			confirmButtonText: this.utils.nullToObject(payload.confirmButtonText, 'OK'),
			showCancelButton: ('cancelButtonText' in payload),
			cancelButtonText: this.utils.nullToObject(payload.cancelButtonText, 'Cancel'),
			allowOutsideClick: false,
			allowEscapeKey: false,
			onClose: function () {
				$this.queue.splice(0, 1);

				// SweetAlert takes some time to close. Triggering next request after some time.
				setTimeout(() => {
					$this.processNext();
				}, 200);
			}
		})
		.then(
		(result) => {
			if (result.dismiss === swal.DismissReason.cancel && payload.onCancel) {
				payload.onCancel();
			} else if (result.dismiss === swal.DismissReason.close && payload.onClose) {
				payload.onClose();
			} else if (result.value === true && payload.onConfirm) {
				payload.onConfirm();
			}
		});
	}
}
