figma.showUI(__html__, {width: 300, height: 420, themeColors: true /* other options */});

// restore previous size
// figma.clientStorage.getAsync('size').then(size => {
//   if(size) figma.ui.resize(size.w,size.h);
// }).catch(err=>{});
// figma.ui.onmessage = msg => {
//   switch (msg.type) {
//     case "resize":
//       figma.ui.resize(msg.size.w,msg.size.h);
//       figma.clientStorage.setAsync('size', msg.size).catch(err=>{});// save size
//       break;
//   }
// };

let currentViewX = figma.viewport.center.x;
let currentViewY = figma.viewport.center.y;

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'create') {
        const nodes = [];
        const items = JSON.parse(msg.items);
        const count = items.length;
        // console.log(items);
        const baseSize = 512;
        const size = 248;
        figma.loadFontAsync({family: 'Inter', style: 'Regular'});
        figma.loadFontAsync({family: 'Inter', style: 'Italic'});
        figma.loadFontAsync({family: 'Inter', style: 'Medium'});
        figma.loadFontAsync({family: 'Inter', style: 'Bold'});

        const container = figma.createFrame();
        container.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}, opacity: 0}];
        figma.currentPage.appendChild(container);
        container.resize(msg.containerWidth / (baseSize / size), msg.containerHeight / (baseSize / size));
        container.name = 'Artwork';

        for (let i = 0; i < count; i++) {
            const item = items[i];
            const imageOld = item.url;
            const image = imageOld.replace('http', 'https');

            const imageInt = (await fetch(image).then((r) => r.arrayBuffer())) as Uint8Array;
            let imageHash = figma.createImage(new Uint8Array(imageInt)).hash;

            const frame = figma.createFrame();
            frame.fills = [
                {type: 'SOLID', color: {r: 0, g: 0, b: 0}, opacity: 0},
                {type: 'IMAGE', scaleMode: 'FILL', imageHash},
            ];

            const finalWidth = msg.containerWidth / (baseSize / size) - item.x * size;
            const finalHeight = msg.containerHeight / (baseSize / size) - item.y * size;

            let frameWidth = item.x === msg.maxX ? finalWidth : size;
            let frameHeight = item.y === msg.maxY ? finalHeight : size;
            frame.resize(frameWidth, frameHeight);
            frame.x = item.x * size;
            frame.y = item.y * size;
            // console.log(frame.height, frame.width)

            container.appendChild(frame);
        }

        const pictureFrame = figma.createFrame();
        pictureFrame.name = msg.artworkTitle;
        pictureFrame.x = Math.floor(currentViewX);
        pictureFrame.y = Math.floor(currentViewY);
        pictureFrame.clipsContent = true;
        pictureFrame.layoutMode = 'HORIZONTAL';
        pictureFrame.layoutAlign = 'STRETCH';
        pictureFrame.counterAxisSizingMode = 'AUTO';
        pictureFrame.verticalPadding = 48;
        pictureFrame.horizontalPadding = 48;
        pictureFrame.strokes = [{type: 'SOLID', color: {r: 0.47, g: 0.27, b: 0.13}, opacity: 1}];
        pictureFrame.strokeWeight = 8;
        pictureFrame.strokeCap = 'ROUND';
        pictureFrame.dashPattern = [12, 24];
        pictureFrame.strokeAlign = 'OUTSIDE';
        pictureFrame.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 1}];
        pictureFrame.effects = [
            {
                type: 'INNER_SHADOW',
                color: {r: 0, g: 0, b: 0, a: 0.25},
                offset: {x: -12, y: -12},
                radius: 12,
                spread: 24,
                visible: true,
                blendMode: 'NORMAL',
            },
            {
                type: 'INNER_SHADOW',
                color: {r: 0.62, g: 0.35, b: 0.17, a: 1},
                offset: {x: 0, y: 0},
                radius: 0,
                spread: 32,
                visible: true,
                blendMode: 'NORMAL',
            },
            {
                type: 'INNER_SHADOW',
                color: {r: 0.83, g: 0.55, b: 0.37, a: 1},
                offset: {x: 0, y: 0},
                radius: 0,
                spread: 24,
                visible: true,
                blendMode: 'NORMAL',
            },
            {
                type: 'INNER_SHADOW',
                color: {r: 0.47, g: 0.27, b: 0.13, a: 1},
                offset: {x: 0, y: 0},
                radius: 0,
                spread: 16,
                visible: true,
                blendMode: 'NORMAL',
            },
            {
                type: 'DROP_SHADOW',
                color: {r: 0, g: 0, b: 0, a: 0.08},
                offset: {x: 0, y: 48},
                radius: 40,
                visible: true,
                blendMode: 'NORMAL',
            },
            {
                type: 'DROP_SHADOW',
                color: {r: 0, g: 0, b: 0, a: 0.08},
                offset: {x: 0, y: 48},
                radius: 40,
                visible: true,
                blendMode: 'NORMAL',
            },
            {
                type: 'DROP_SHADOW',
                color: {r: 0, g: 0, b: 0, a: 0.08},
                offset: {x: 0, y: 64},
                radius: 48,
                visible: true,
                blendMode: 'NORMAL',
            },
        ];

        container.effects = [
            {
                type: 'INNER_SHADOW',
                color: {r: 0, g: 0, b: 0, a: 0.2},
                offset: {x: -8, y: -8},
                radius: 4,
                visible: true,
                blendMode: 'NORMAL',
            },
            {
                type: 'INNER_SHADOW',
                color: {r: 0, g: 0, b: 0, a: 0.4},
                offset: {x: -16, y: -16},
                radius: 32,
                spread: 0,
                visible: true,
                blendMode: 'NORMAL',
            },
        ];

        pictureFrame.appendChild(container);
        nodes.push(pictureFrame);

        if (msg.caption === true) {
            const caption = figma.createFrame();
            caption.name = 'Caption';
            caption.resize(320, 100);
            caption.clipsContent = true;
            caption.layoutMode = 'VERTICAL';
            caption.layoutAlign = 'STRETCH';
            caption.counterAxisSizingMode = 'FIXED';
            caption.verticalPadding = 32;
            caption.horizontalPadding = 32;
            caption.itemSpacing = 12;
            caption.x = Math.floor(currentViewX);
            caption.y = Math.floor(currentViewY) + (msg.containerHeight / (baseSize / size) + 48 + 100);

            const captionHeader = figma.createFrame();
            captionHeader.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 1, visible: false}];
            captionHeader.name = 'captionHeader';
            captionHeader.clipsContent = true;
            captionHeader.layoutMode = 'VERTICAL';
            captionHeader.layoutAlign = 'STRETCH';
            captionHeader.counterAxisSizingMode = 'AUTO';

            const captionTitle = figma.createText();
            captionTitle.fontName = {family: 'Inter', style: 'Bold'};
            captionTitle.fontSize = 14;
            captionTitle.layoutAlign = 'STRETCH';
            captionTitle.characters = msg.label.label.title === undefined ? '-' : msg.label.label.title;

            const captionArtist = figma.createText();
            captionArtist.fontName = {family: 'Inter', style: 'Italic'};
            captionArtist.fontSize = 12;
            captionArtist.layoutAlign = 'STRETCH';
            captionArtist.characters = msg.label.label.makerLine === undefined ? '-' : msg.label.label.makerLine;

            const captionText = figma.createText();
            captionText.layoutAlign = 'STRETCH';
            captionText.fontSize = 10;
            captionText.characters =
                msg.label.plaqueDescriptionEnglish == undefined
                    ? msg.label.plaqueDescriptionDutch === undefined
                        ? '-'
                        : msg.label.plaqueDescriptionDutch
                    : msg.label.plaqueDescriptionEnglish;

            captionHeader.appendChild(captionTitle);
            captionHeader.appendChild(captionArtist);
            caption.appendChild(captionHeader);
            caption.appendChild(captionText);
        } else {
        }
        figma.currentPage.selection = [pictureFrame];
        // figma.viewport.scrollAndZoomIntoView(nodes);
        figma.closePlugin();
    }
    figma.closePlugin();
};
