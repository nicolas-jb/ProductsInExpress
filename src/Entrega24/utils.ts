import {
  red,
  green,
  yellow,
  gray,
  blue,
} from "https://deno.land/std@0.123.0/fmt/colors.ts";

let cantidad = 0

function giveMeColor(colorName: string, index: number) {
  switch (colorName) {
    case "red":
      console.log(red(`Orden ${index} - color: ${colorName}`));
      break;
    case "yellow":
      console.log(yellow(`Orden ${index} - color: ${colorName}`));
      break;
    case "blue":
      console.log(blue(`Orden ${index} - color: ${colorName}`));
      break;
    case "gray":
      console.log(gray(`Orden ${index} - color: ${colorName}`));
      break;
    default:
      console.log(green(`Orden ${index} - color: ${colorName}`));
  }
}

export function printArgs(colors: string[]) {
  colors.map((color: string) => {
    giveMeColor(color, cantidad++);
  });
}
