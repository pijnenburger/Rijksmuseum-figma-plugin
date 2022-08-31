import * as React from 'react';
import {Label, Select, Checkbox, Button} from 'react-figma-plugin-ds';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import '../styles/ui.css';
import '../styles/ui.css';

declare function require(path: string): any;

const App = ({}) => {
    const firstUrl =
        'https://www.rijksmuseum.nl/api/nl/collection?key=m6fzmvxx&imgonly=true&toppieces=true&culture=en&ps=100';
    console.log(firstUrl);

    const onCreate = async () => {
        let randomNumber = Math.floor(Math.random() * 100);

        let resFirst = await fetch(firstUrl);
        let jsonFirst = await resFirst.json();

        let collectionID = jsonFirst.artObjects[randomNumber].objectNumber;
        let artworkTitle = jsonFirst.artObjects[randomNumber].longTitle;

        const collectionUrl =
            'https://www.rijksmuseum.nl/api/nl/collection/' + collectionID + '?key=m6fzmvxx&culture=en';
        console.log(collectionUrl);
        let resSecond = await fetch(collectionUrl);
        let jsonSecond = await resSecond.json();

        let label = jsonSecond.artObject;

        console.log(label);

        const fetchUrl = 'https://www.rijksmuseum.nl/api/nl/collection/' + collectionID + '/tiles?key=m6fzmvxx';

        let res = await fetch(fetchUrl);
        let json = await res.json();

        let results = json.levels.filter((obj) => {
            return obj.name === 'z1';
        });

        const containerWidth = results[0].width;
        const containerHeight = results[0].height;
        const items = results[0].tiles;
        // console.log(items);
        console.log(jsonSecond);

        const maxX = Math.max.apply(
            Math,
            items.map(function (o: any) {
                return o.x;
            })
        );
        const maxY = Math.max.apply(
            Math,
            items.map(function (o: any) {
                return o.y;
            })
        );
        // console.log(maxX, maxY);

        // const count = 3;
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'create-rectangles',
                    items: JSON.stringify(items),
                    containerWidth: parseInt(containerWidth, 10),
                    containerHeight: parseInt(containerHeight, 10),
                    maxX,
                    maxY,
                    artworkTitle,
                    label,
                },
            },
            '*'
        );
    };

    // const onCancel = () => {
    //     parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
    // };

    return (
        <div className="form">
            <Checkbox type="switch" label="Artwork caption" />
            <Button className="primary-btn" onClick={onCreate}>
                Create Art
            </Button>
        </div>
    );
};

export default App;
