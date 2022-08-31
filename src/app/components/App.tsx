import * as React from 'react';
import {useState} from 'react';
import {Range, getTrackBackground} from 'react-range';
import {Label, Select, Checkbox, Button} from 'react-figma-plugin-ds';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import '../styles/ui.css';
import '../styles/ui.css';

declare function require(path: string): any;

const App = ({}) => {
    const step = 1;
    const min = 0;
    const max = 4;

    const [data, setData] = useState({
        values: [3],
        objectType: 'all',
        caption: true,
        toppieces: 'true',
    });

    const qualityLabel = {
        4: 'Ultra',
        3: 'Very High',
        2: 'High',
        1: 'Medium',
        0: 'Low',
    };

    const qualityLevel = {
        4: 'z0',
        3: 'z1',
        2: 'z2',
        1: 'z3',
        0: 'z4',
    };

    const valuesHandler = (event) => {
        setData({...data, values: event});
        console.log(event);
    };

    const typeHandler = (event) => {
        setData({...data, objectType: event.value});
    };

    const captionHandler = (event) => {
        setData({...data, caption: event});
        console.log(event);
    };

    const toppiecesHandler = (event) => {
        setData({...data, toppieces: event});
        console.log(event);
    };

    const onCreate = async () => {
        let objectFilter = data.objectType === 'all' ? '' : '&type=' + data.objectType;
        console.log(objectFilter);

        const firstUrl =
            'https://www.rijksmuseum.nl/api/nl/collection?key=m6fzmvxx&imgonly=true&toppieces=' +
            data.toppieces.toString() +
            '&culture=en&ps=100' +
            objectFilter;
        console.log(firstUrl);

        let randomNumber = Math.floor(Math.random() * 100);

        let resFirst = await fetch(firstUrl);
        let jsonFirst = await resFirst.json();

        let collectionID = jsonFirst.artObjects[randomNumber].objectNumber;
        let artworkTitle = jsonFirst.artObjects[randomNumber].longTitle;

        const collectionUrl =
            'https://www.rijksmuseum.nl/api/nl/collection/' + collectionID + '?key=m6fzmvxx&culture=en';
        let resSecond = await fetch(collectionUrl);
        let jsonSecond = await resSecond.json();

        let label = jsonSecond.artObject;

        const fetchUrl = 'https://www.rijksmuseum.nl/api/nl/collection/' + collectionID + '/tiles?key=m6fzmvxx';

        let res = await fetch(fetchUrl);
        let json = await res.json();

        let results = json.levels.filter((obj) => {
            return obj.name === qualityLevel[data.values[0]];
        });

        const containerWidth = results[0].width;
        const containerHeight = results[0].height;
        const items = results[0].tiles;
        // console.log(items);
        // console.log(jsonSecond);

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
                    type: 'create',
                    items: JSON.stringify(items),
                    containerWidth: parseInt(containerWidth, 10),
                    containerHeight: parseInt(containerHeight, 10),
                    maxX,
                    maxY,
                    artworkTitle,
                    label,
                    caption: data.caption,
                },
            },
            '*'
        );
    };

    return (
        <div className="form">
            <div className="row">
                <div className="input-container">
                    <div className="row">
                        <Label>Quality</Label>
                        <Label className="label-right">{qualityLabel[data.values[0]]}</Label>
                    </div>
                    <Range
                        values={data.values}
                        step={step}
                        min={min}
                        max={max}
                        onChange={valuesHandler}
                        renderTrack={({props, children}) => (
                            <div
                                onMouseDown={props.onMouseDown}
                                onTouchStart={props.onTouchStart}
                                style={{
                                    ...props.style,
                                    height: '36px',
                                    display: 'flex',
                                    width: '100%',
                                }}
                            >
                                <div
                                    ref={props.ref}
                                    style={{
                                        height: '6px',
                                        width: '100%',
                                        borderRadius: '4px',
                                        background: getTrackBackground({
                                            values: data.values,
                                            colors: ['var(--figma-color-bg-brand)', 'var(--figma-color-bg-secondary)'],
                                            min: min,
                                            max: max,
                                        }),
                                        alignSelf: 'center',
                                    }}
                                >
                                    {children}
                                </div>
                            </div>
                        )}
                        renderThumb={({props}) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: '16px',
                                    width: '16px',
                                    borderRadius: '16px',
                                    border: '1px solid var(--figma-color-border-onbrand)',
                                    backgroundColor: 'var(--figma-color-text-onbrand)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            ></div>
                        )}
                    ></Range>
                </div>
            </div>
            <div className="row">
                <Label>Type</Label>
                <Select
                    defaultValue={'all'}
                    onChange={typeHandler}
                    options={[
                        {
                            label: 'All',
                            value: 'all',
                        },
                        {
                            label: 'Painting',
                            value: 'painting',
                        },
                        {
                            label: 'Print',
                            value: 'print',
                        },
                        {
                            label: 'Photograph',
                            value: 'photograph',
                        },
                        {
                            label: 'Drawing',
                            value: 'drawing',
                        },
                        {
                            label: 'Sculture',
                            value: 'sculpture',
                        },
                    ]}
                />
            </div>
            <div className="row">
                <Label>Toppieces only</Label>
                <Checkbox defaultValue={true} type="switch" onChange={toppiecesHandler} />
            </div>
            <div className="row">
                <Label>Caption {/*{data.caption === true ? "With caption" : "No caption"}*/}</Label>
                <Checkbox defaultValue={true} type="switch" onChange={captionHandler} />
            </div>
            <Button className="primary-btn flex-grow" onClick={onCreate}>
                Create Art
            </Button>
        </div>
    );
};

export default App;
