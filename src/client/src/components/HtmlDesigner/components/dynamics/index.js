import grapes from 'grapesjs';
import loadComponents from './components';
import loadBlocks from './blocks';
import {
    countdownRef
} from './consts';

export default grapes.plugins.add('dynamics', (editor, options = {}) => {
    let opts = options;

    let defaults = {

        blocks: [
            countdownRef // 'countdown'
        ],

        // Default style
        defaultStyle: true,

        // Default start time, eg. '2018-01-25 00:00'
        startTime: '',

        // Text to show when the countdown is ended
        endText: 'EXPIRED',

        // Date input type, eg, 'date', 'datetime-local'
        dateInputType: 'date',

        // Countdown class prefix
        countdownClsPfx: 'countdown',

        // Countdown label
        labelCountdown: 'Countdown',

        // Countdown category label
        labelCountdownCategory: 'Extra',

        // Days label text used in component
        labelDays: 'days',

        // Hours label text used in component
        labelHours: 'hours',

        // Minutes label text used in component
        labelMinutes: 'minutes',

        // Seconds label text used in component
        labelSeconds: 'seconds',
    };

    // Load defaults
    for (let name in defaults) {
        if (!(name in opts))
            opts[name] = defaults[name];
    }

    // Add components
    loadComponents(editor, opts);

    // Add components
    loadBlocks(editor, opts);

});
