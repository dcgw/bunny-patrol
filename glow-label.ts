import {Color, Label} from "excalibur";
import {LabelArgs} from "excalibur/dist/Label";

export interface GlowLabelArgs extends LabelArgs {
    glowColor: Color;
    glowWidth: number;
}

export default function glowLabel(config: GlowLabelArgs): Label {
    const label = new Label(config);
    label.draw = (ctx) => {
        ctx.save();
        ctx.translate(label.pos.x, label.pos.y);
        ctx.scale(label.scale.x, label.scale.y);
        ctx.rotate(label.rotation);

        ctx.textAlign = (label as any)._lookupTextAlign(label.textAlign);
        ctx.textBaseline = (label as any)._lookupBaseAlign(label.baseAlign);
        if (label.color) {
            label.color.a = label.opacity;
        }
        ctx.fillStyle = label.color.toString();
        ctx.font = (label as any)._fontString;

        ctx.shadowBlur = config.glowWidth;
        ctx.shadowColor = config.glowColor.toString();
        ctx.lineWidth = config.glowWidth;
        ctx.strokeStyle = config.glowColor.toString();

        ctx.strokeText(label.text, 0, 0, label?.maxWidth);

        ctx.shadowColor = Color.Transparent.toString();

        ctx.fillText(label.text, 0, 0, label?.maxWidth);

        ctx.restore();
    };
    return label;
}