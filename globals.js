//// Wannabe constants ////
// Colors
var color_Black = new Color(0, 0, 0, 1);
var color_Red = new Color(255, 0, 0, 1);
var color_Green = new Color(0, 255, 0, 1);
var color_Blue = new Color(0, 0, 255, 1);
// Line stuff
var numberlineX = 50;
var numberlineY = 180;
var numberlineWidth = 800;
var numberlineColor = color_Black;
var numberlineThickness = 3;
var numberlineTickThickness = 1;
var numberlineValueThickness = 2;
var numberlineEndpointHeight = 20;
var numberlineTickHeight = 10;
var numberlineValueTickHeight = 17;
// Label stuff
var numberlineEndpointFontSize = 20;
var numberlineTickFontSize = 15;
var numberlineValueFontSize = 15;
var numberlineSmallFontSize = 10;
var numberlineEndpointLabelGap = 45;
var numberlineTickLabelGap = 30;
var numberlineValueLabelGap = -35;
var numberlineFractionBarThickness = 1;
var numberLineShortenFranctionsAt = 6;
// Region stuff
var currentRegion;
var regionY = 100;
var regionColor = color_Blue;
var regionHighlightColor = color_Red;
var regionThickness = 3;
var regionTickHeight = 20;
var regionFontSize = 20;
var regionLabelGap = 10;
// Value stuff
var valueColor = color_Red;
var minNumerator = 0;
var maxNumerator = 999;
var minDenominator = 1;
var maxDenominator = 1000;
// Decimal expansion stuff
var expansionColor = color_Black;
var expansionFontSize = 40;
var expansionX = 50;
var expansionY = 50;
var currentDecimalExpansion;
var addNines = false;
// Shorthand N stuff
var shorthandNX = numberlineWidth / 3;
var shorthandNY = 280;
var shorthandNFontSize = 20;
// Interval stuff
var nextInterval;
// Animation stuff
var animationSpeed;
var delayBetweenAnimations = 1000;
var maxNumberOfDigits = 34;

//// Global Variables ////
// DOM stuff
var canvas;
var ctx;
var messageArea;
// Numbers
var inputNumerator;
var inputDenominator;
var currentLeftNumerator;
var currentDenominator;
var value;
var valuePosition;
var fromTheRight = true;
// Drawings
var primaryLineDrawing = new Drawing();
var regionDrawing = new Drawing();
var regionChoiceDrawing = new Drawing();
var primaryNumberlineTicks = new Drawing();
var newNumberline = new Drawing();
var valueTick = new Drawing();
var regionHighlight = new Drawing();
var shorthandN = new Drawing();
// Region selection
var leftRegion;
var rightRegion;
var awaitingInput = false;
var regionSelected = false;

// Animations
var mainAnimation;
var highlightAnimation;
var delayTimer;
var animationStarted = false;

var canvasBorder;
