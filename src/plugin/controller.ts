figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        const items = JSON.parse(msg.items);
        const itemContainer = JSON.parse(msg.itemContainer);
        console.log(itemContainer);
        const count = items.length;
        // console.log(items);

        const container = figma.createFrame();
        container.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
        figma.currentPage.appendChild(container);
        container.resize(itemContainer.width / 5, itemContainer.height / 5);

        for (let i = 0; i < count; i++) {
            const item = items[i];
            // const image = item.webImage.url;
            const imageOld = item.url;
            const image = imageOld.replace('http', 'https');
            // console.log(image);

            const imageInt = (await fetch(image).then((r) => r.arrayBuffer())) as Uint8Array;
            let imageHash = figma.createImage(new Uint8Array(imageInt)).hash;

            const frame = figma.createFrame();
            frame.fills = [
                {type: 'SOLID', color: {r: 0, g: 0, b: 0}},
                {type: 'IMAGE', scaleMode: 'FILL', imageHash},
            ];
            frame.resize(100, 100);
            frame.x = item.x * 100;
            frame.y = item.y * 100;
            // frame.resize(item.headerImage.width, item.headerImage.height);
            container.appendChild(frame);
            nodes.push(frame);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);

        // This is how figma responds back to the ui
        figma.ui.postMessage({
            type: 'create-rectangles',
            message: `Created ${msg.count} Rectangles`,
        });
    }

    figma.closePlugin();
};
