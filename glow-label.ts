import {Color, Label, TextAlign} from "excalibur";
import {LabelArgs} from "excalibur/dist/Label";

export interface GlowLabelArgs extends LabelArgs {
    glowColor: Color;
    glowWidth: number;
    wrapWidth?: number;
    lineHeight?: number;
}

const drawText = (ctx: CanvasRenderingContext2D, text: string, glowWidth: number,
                  glowColor: Color, yOffset: number, maxWidth?: number): void => {
    ctx.shadowBlur = glowWidth;
    ctx.shadowColor = glowColor.toString();
    ctx.lineWidth = glowWidth;
    ctx.strokeStyle = glowColor.toString();

    ctx.strokeText(text, 0, yOffset, maxWidth);

    ctx.shadowColor = Color.Transparent.toString();

    ctx.fillText(text, 0, yOffset, maxWidth);
};

const wrapLines = (ctx: CanvasRenderingContext2D, text: string, wrapWidth: number): string[] =>
    text.split(/\s+/)
        .reduce(([line, ...lines]: string[], word) =>
            !line ? [word] : ctx.measureText(line + " " + word).width < wrapWidth
                ? [line + " " + word, ...lines]
                : [word, line, ...lines], [])
        .reverse();

export default function glowLabel(config: GlowLabelArgs): Label {
    const label = new Label(config);
    label.draw = (ctx) => {
        ctx.save();
        ctx.translate(label.pos.x, label.pos.y);
        ctx.scale(label.scale.x, label.scale.y);
        ctx.rotate(label.rotation);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,no-underscore-dangle
        ctx.textAlign = (label as any)._lookupTextAlign(label.textAlign);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,no-underscore-dangle
        ctx.textBaseline = (label as any)._lookupBaseAlign(label.baseAlign);
        if (label.color) {
            label.color.a = label.opacity;
        }
        ctx.fillStyle = label.color.toString();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,no-underscore-dangle
        ctx.font = (label as any)._fontString;

        const {glowWidth, glowColor, wrapWidth, lineHeight} = config;
        if (wrapWidth && lineHeight) {
            wrapLines(ctx, label.text, wrapWidth)
                .forEach((line, idx) =>
                    drawText(ctx, line, glowWidth, glowColor, idx * lineHeight, label.maxWidth));
        } else {
            drawText(ctx, label.text, glowWidth, glowColor, 0, label.maxWidth);
        }

        ctx.restore();
    };
    return label;
}