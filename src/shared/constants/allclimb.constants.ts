export const ALLCLIMB_URL = 'https://www.allclimb.com';
export const ALLCLIMB_SEARCH = 'https://www.allclimb.com/new_search_for';

export const SEARCH_TABS=[
    'query',
    'region'
];

export const DIFFICULTY = [
    '4a', '4a+', '4b', '4b+', '4c', '4c+',
    '5a', '5a+', '5b', '5b+', '5c', '5c+',
    '6a', '6a+', '6b', '6b+', '6c', '6c+',
    '7a', '7a+', '7b', '7b+', '7c', '7c+',
    '8a', '8a+', '8b', '8b+', '8c', '8c+',
    '9a', '9a+', '9b', '9b+', '9c', '9c+'
]

export const GRADES_COLORS: Record<string, string> = {
    '4a': '#00bcff',    // sky-400
    '4b': '#00a6f4',    // sky-500
    '4c': '#0084d1',    // sky-600
    '5a': '#00bcff',    // sky-400
    '5b': '#00a6f4',    // sky-500
    '5c': '#0084d1',    // sky-600
    '6a': '#5ee9b5',    // emerald-300
    '6b': '#00d492',    // emerald-400
    '6c': '#00bc7d',    // emerald-500
    '7a': '#fda5d6',    // pink-300
    '7b': '#fb64b6',    // pink-400
    '7c': '#f6339a',    // pink-500
    '8a': '#ffdf20',    // yellow-300
    '8b': '#fdc700',    // yellow-400
    '8c': '#f0b100',    // yellow-500
    '9a': '#c27aff',    // purple-400
    '9b': '#ad46ff',    // purple-500
    '9c': '#9810fa',    // purple-600
};

export const GRADES = Object.keys(GRADES_COLORS);