import UAParser from 'ua-parser-js';

export const isMobile = () => ['mobile', 'tablet'].includes(UAParser().device.type);
