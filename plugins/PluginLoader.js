import React, { useEffect } from 'react';

function PluginLoader({ pluginName }) {
    useEffect(() => {
        import(`./plugins/${pluginName}`).then((plugin) => {
            plugin.default(); // Run plugin's main function
        });
    }, [pluginName]);

    return <div>Loading Plugin: {pluginName}</div>;
}

export default PluginLoader;
