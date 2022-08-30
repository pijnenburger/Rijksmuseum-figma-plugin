import * as React from 'react';
import '../styles/ui.css';

declare function require(path: string): any;

const App = ({}) => {
    // const baseUrl =
    //     'https://www.rijksmuseum.nl/api/nl/collection?key=m6fzmvxx';

    // const fqMaker = '&involvedMaker=Rembrandt+van+Rijn';
    // const fqImg = '&imgonly=true';
    // const fqToppieces = '&toppieces=true';

    // const fetchUrl = baseUrl + fqMaker + fqImg + fqToppieces;
    const fetchUrl = 'https://www.rijksmuseum.nl/api/nl/collection/SK-C-5/tiles?key=m6fzmvxx';

    const onCreate = async () => {
        let res = await fetch(fetchUrl);
        let json = await res.json();
        // let items = json.artObjects;
        let items = json.levels[2].tiles;
        let itemContainer = json.levels[2];

        // console.log(fetchUrl);
        // console.log(items);

        // const count = 3;
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'create-rectangles',
                    items: JSON.stringify(items),
                    itemContainer: JSON.stringify(itemContainer),
                },
            },
            '*'
        );
    };

    const onCancel = () => {
        parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
    };

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);

    return (
        <div>
            <button id="create" onClick={onCreate}>
                Give me some art
            </button>
            {/* <button onClick={onCancel}>Cancel</button> */}
        </div>
    );
};

export default App;
