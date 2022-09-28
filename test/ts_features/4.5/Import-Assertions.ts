/// <reference lib="es2015" />

import obj from "./something.json" assert { type: "json" };

obj.type === 'json';

(async () => {
    const obj = await import('./something.json', {
        assert: { type: 'json' }
    })

    obj.type === 'json';
})();
