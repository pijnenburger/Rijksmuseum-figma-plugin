figma.showUI(__html__, {themeColors: true /* other options */});
figma.ui.resize(300, 400);

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'create') {
        const nodes = [];
        const items = JSON.parse(msg.items);
        const count = items.length;
        // console.log(items);
        const size = 128;
        figma.loadFontAsync({family: 'Inter', style: 'Regular'});
        figma.loadFontAsync({family: 'Inter', style: 'Italic'});
        figma.loadFontAsync({family: 'Inter', style: 'Medium'});
        figma.loadFontAsync({family: 'Inter', style: 'Bold'});

        const container = figma.createFrame();
        container.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}, opacity: 0}];
        figma.currentPage.appendChild(container);
        container.resize(msg.containerWidth / (512 / size), msg.containerHeight / (512 / size));
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

            const finalWidth = msg.containerWidth / (512 / size) - item.x * size;
            const finalHeight = msg.containerHeight / (512 / size) - item.y * size;

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
        pictureFrame.clipsContent = true;
        pictureFrame.layoutMode = 'HORIZONTAL';
        pictureFrame.layoutAlign = 'STRETCH';
        pictureFrame.counterAxisSizingMode = 'AUTO';
        pictureFrame.verticalPadding = 32;
        pictureFrame.horizontalPadding = 32;
        pictureFrame.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
        pictureFrame.strokeWeight = 12;
        pictureFrame.strokeAlign = 'OUTSIDE';
        pictureFrame.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}, opacity: 0.8}];
        pictureFrame.effects = [
            {
                type: 'DROP_SHADOW',
                color: {r: 0, g: 0, b: 0, a: 0.11},
                offset: {x: 0, y: 100},
                radius: 92,
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
        ];

        container.effects = [
            {
                type: 'DROP_SHADOW',
                color: {r: 0, g: 0, b: 0, a: 0.11},
                offset: {x: 0, y: 100},
                radius: 92,
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
            caption.x = 0;
            caption.y = msg.containerHeight / (512 / size) + 100;

            const captionHeader = figma.createFrame();
            captionHeader.name = 'captionHeader';
            captionHeader.clipsContent = true;
            captionHeader.layoutMode = 'VERTICAL';
            captionHeader.layoutAlign = 'STRETCH';
            captionHeader.counterAxisSizingMode = 'AUTO';

            const captionTitle = figma.createText();
            captionTitle.fontName = {family: 'Inter', style: 'Bold'};
            captionTitle.fontSize = 14;
            captionTitle.layoutAlign = 'STRETCH';
            captionTitle.characters = msg.label.label.title;

            const captionArtist = figma.createText();
            captionArtist.fontName = {family: 'Inter', style: 'Italic'};
            captionArtist.fontSize = 12;
            captionArtist.layoutAlign = 'STRETCH';
            captionArtist.characters = msg.label.label.makerLine;

            const captionText = figma.createText();
            captionText.layoutAlign = 'STRETCH';
            captionText.fontSize = 10;
            captionText.characters =
                msg.label.plaqueDescriptionEnglish == null
                    ? msg.label.plaqueDescriptionDutch
                    : msg.label.plaqueDescriptionEnglish;

            captionHeader.appendChild(captionTitle);
            captionHeader.appendChild(captionArtist);
            caption.appendChild(captionHeader);
            caption.appendChild(captionText);
        } else figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
        figma.closePlugin();
    }
    figma.closePlugin();
};
