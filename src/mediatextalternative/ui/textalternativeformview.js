/**
 * @module media/mediatextalternative/mediatextalternative/textalternativeformview
 */
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';
import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';
import '../../../theme/textalternativeform.css';

export default class TextAlternativeFormView extends View {
    constructor(locale) {
        super(locale);

        const t = this.locale.t;
        this.focusTracker = new FocusTracker();
        this.keystrokes = new KeystrokeHandler();
        this.labeledInput = this._createLabeledInputView();
        this.saveButtonView = this._createButton(t('Save'), checkIcon, 'ck-button-save');
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton(t('Cancel'), cancelIcon, 'ck-button-cancel', 'cancel');
        this._focusables = new ViewCollection();
        this._focusCycler = new FocusCycler({
            focusables: this._focusables,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                focusPrevious: 'shift + tab',
                focusNext: 'tab'
            }
        });

        this.setTemplate({
            tag: 'form',
            attributes: {
                class: [
                    'ck',
                    'ck-text-alternative-form',
                ],
                tabindex: '-1'
            },
            children: [
                this.labeledInput,
                this.saveButtonView,
                this.cancelButtonView
            ]
        });
    }

    render() {
        super.render();

        this.keystrokes.listenTo(this.element);

        submitHandler({view: this});

        [this.labeledInput, this.saveButtonView, this.cancelButtonView]
            .forEach(v => {
                this._focusables.add(v);
                this.focusTracker.add(v.element);
            });
    }

    _createButton(label, icon, className, eventName) {
        const button = new ButtonView(this.locale);

        button.set({
            label,
            icon,
            tooltip: true
        });

        button.extendTemplate({
            attributes: {
                class: className
            }
        });

        if (eventName) {
            button.delegate('execute').to(this, eventName);
        }

        return button;
    }

    _createLabeledInputView() {
        const t = this.locale.t;
        const labeledInput = new LabeledInputView(this.locale, InputTextView);

        labeledInput.label = t('Text alternative');
        labeledInput.inputView.placeholder = t('Text alternative');

        return labeledInput;
    }
}
