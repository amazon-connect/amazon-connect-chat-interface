import {
  createInteractiveMessagePayload,
  INTERACTIVE_MESSAGE_CONSTRAINTS,
  truncateElementFromLimit,
  truncateStrFromCharLimit,
  constructGuidesRendererUrl,
  setupGuidesRenderer
} from "./helper";
import { InteractiveMessageType } from "../components/Chat/datamodel/Model";

describe("createInteractiveMessagePayload addMessage helper", () => {
  const MOCK_TEMPLATE_IDENTIFIER = "pickerList001";
  const MOCK_PICKER_TITLE = "Hotels";
  const MOCK_PICKER_SELECTION = "Learn More";

  it("should format Panel message response", () => {
    const IS_PICKER_IN_CAROUSEL = false;

    const interactiveMessagePayload = createInteractiveMessagePayload(
      { title: MOCK_PICKER_SELECTION },
      "preIndex",
      "nextIndex",
      MOCK_TEMPLATE_IDENTIFIER,
      "referenceId",
      "Panel",
      IS_PICKER_IN_CAROUSEL,
      MOCK_TEMPLATE_IDENTIFIER,
      MOCK_PICKER_TITLE,
      undefined
    );
    expect(interactiveMessagePayload).toEqual({
      text: MOCK_PICKER_SELECTION,
    });
  });

  it("should format Carousel message response", () => {
    const IS_PICKER_IN_CAROUSEL = true;

    const interactiveMessagePayload = createInteractiveMessagePayload(
      { title: MOCK_PICKER_SELECTION },
      "preIndex",
      "nextIndex",
      "listId",
      "Panel",
      "referenceId",
      IS_PICKER_IN_CAROUSEL,
      MOCK_PICKER_TITLE,
      MOCK_TEMPLATE_IDENTIFIER
    );
    expect(interactiveMessagePayload).toEqual({
      text: JSON.stringify({
        templateIdentifier: MOCK_TEMPLATE_IDENTIFIER,
        listTitle: MOCK_PICKER_TITLE,
        selectionText: MOCK_PICKER_SELECTION,
      }),
    });
  });
});

/**
 * Assert expected frontend limits for interactive message fields
 * 
 * Assure that future changes will also follow documentation 
 * 
 * Documentation: https://docs.aws.amazon.com/connect/latest/adminguide/interactive-messages.html
 */
describe("Interactive Message Constraints", () => {
  describe(InteractiveMessageType.PANEL, () => {
    const PANEL_CONSTRAINTS = INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.PANEL];

    it("should include constraints matching public documentation", () => {
      expect(PANEL_CONSTRAINTS).toHaveProperty("titleCharLimit", 400);
      expect(PANEL_CONSTRAINTS).toHaveProperty("subtitleCharLimit", 400);
      expect(PANEL_CONSTRAINTS).toHaveProperty("elementTitleCharLimit", 400);
    });
  });

  describe(InteractiveMessageType.LIST_PICKER, () => {
    const LIST_PICKER_CONSTRAINTS = INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.LIST_PICKER];

    it("should include constraints matching public documentation", () => {
      expect(LIST_PICKER_CONSTRAINTS).toHaveProperty("titleCharLimit", 400);
      expect(LIST_PICKER_CONSTRAINTS).toHaveProperty("subtitleCharLimit", 400);
      expect(LIST_PICKER_CONSTRAINTS).toHaveProperty("elementTitleCharLimit", 400);
      expect(LIST_PICKER_CONSTRAINTS).toHaveProperty("elementSubtitleCharLimit", 400);
    });
  });

  describe(InteractiveMessageType.TIME_PICKER, () => {
    const TIME_PICKER_CONSTRAINTS = INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.TIME_PICKER];

    it("should include constraints matching public documentation", () => {
      expect(TIME_PICKER_CONSTRAINTS).toHaveProperty("titleCharLimit", 400);
      expect(TIME_PICKER_CONSTRAINTS).toHaveProperty("subtitleCharLimit", 400);
    });
  });

  describe(InteractiveMessageType.CAROUSEL, () => {
    const CAROUSEL_CONSTRAINTS = INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.CAROUSEL];

    it("should include constraints matching public documentation", () => {
      expect(CAROUSEL_CONSTRAINTS).toHaveProperty("titleCharLimit", 400);
    });
  });

  describe(InteractiveMessageType.QUICK_REPLY, () => {
    const QUICK_REPLY_CONSTRAINTS = INTERACTIVE_MESSAGE_CONSTRAINTS[InteractiveMessageType.QUICK_REPLY];

    it("should include constraints matching public documentation", () => {
      expect(QUICK_REPLY_CONSTRAINTS).toHaveProperty("titleCharLimit", 400);
      expect(QUICK_REPLY_CONSTRAINTS).toHaveProperty("replyOptionCharLimit", 200);
    });
  });
});

describe("truncateStrFromCharLimit util", () => {
  it("should truncate the string if it exceeds the maximum length", () => {
    const longTitle = "LongTitle".repeat(99);
    const expectedTruncatedTitle = longTitle.substring(0, 400) + "...";
    expect(
      truncateStrFromCharLimit(
        longTitle,
        InteractiveMessageType.PANEL,
        "titleCharLimit"
      )
    ).toBe(expectedTruncatedTitle);
  });

  it("should not truncate the string if it does not exceed the maximum length", () => {
    const longTitle = "LongTitle".repeat(10);
    expect(
      truncateStrFromCharLimit(
        longTitle,
        InteractiveMessageType.PANEL,
        "titleCharLimit"
      )
    ).toBe(longTitle);
  });

  it("should return an empty string if the input string is invalid", () => {
    expect(
      truncateStrFromCharLimit("Title", InteractiveMessageType.PANEL, undefined)
    ).toEqual("");
    expect(
      truncateStrFromCharLimit("Title", undefined, "titleCharLimit")
    ).toEqual("");
    expect(
      truncateStrFromCharLimit(
        undefined,
        InteractiveMessageType.PANEL,
        "titleCharLimit"
      )
    ).toEqual("");
    expect(
      truncateStrFromCharLimit(
        null,
        InteractiveMessageType.PANEL,
        "titleCharLimit"
      )
    ).toEqual("");
    expect(
      truncateStrFromCharLimit(
        [],
        InteractiveMessageType.PANEL,
        "titleCharLimit"
      )
    ).toEqual("");
    expect(
      truncateStrFromCharLimit(
        "",
        InteractiveMessageType.PANEL,
        "titleCharLimit"
      )
    ).toEqual("");
  });

  it.each([
    ["Title with script <script>alert(\"XSS attack!\");</script>", "Title with script "],
    ["<img src=\"x\" onerror=\"alert(\'XSS attack!\');\">", "<img src=\"x\">"],
    ["<a href=\"javascript:alert(\'XSS attack!\')\">Click me</a>", "<a>Click me</a>"],
    ["<input type=\"text\" value=\"XSS attack!\" onfocus=\"alert(\'XSS attack!\');\">", "<input value=\"XSS attack!\" type=\"text\">"],
    ["<div data-value=\"<img src=x onerror=alert(\'XSS attack!\')>\"></div>", "<div data-value=\"<img src=x onerror=alert('XSS attack!')>\"></div>"],
    ["<div style=\"background-image: url(\'javascript:alert(\'XSS attack!\');\')\"></div>", "<div style=\"background-image: url('javascript:alert('XSS attack!');')\"></div>"],
  ])("should detect and remove any malicious XSS attack snippets", (rawStr, expectedCleanStr) => {
    expect(truncateStrFromCharLimit(rawStr, InteractiveMessageType.PANEL, "titleCharLimit")).toEqual(expectedCleanStr);
  });
});

describe("Guides in Chat", () => {
  it("should be able to generate guides url", () => {
    let url = constructGuidesRendererUrl('test-instance', 'latest');
    expect(url).toEqual('https://test-instance.my.connect.aws/connectwidget/static/views/renderer/latest/index.js');

    url = constructGuidesRendererUrl('test-instance', '2.3.4');
    expect(url).toEqual('https://test-instance.my.connect.aws/connectwidget/static/views/renderer/2.3.4/index.js');
  });

  it("should not be able to generate guides renderer url", () => {
    let url = constructGuidesRendererUrl('test-instance', '');
    expect(url).toEqual('');

    url = constructGuidesRendererUrl();
    expect(url).toEqual('');
  });

  it("should not be able to insert guides renderer script in head when guidesInChat is not provided", () => {
    window.connect = {};
    let props = {};
    setupGuidesRenderer(props);
    expect(document.head.innerHTML).not.toContain('connectwidget/static/views/renderer');
  });

  it("should not be able to insert guides renderer script in head when invalid config is provided", () => {
    window.connect = {};
    let props = { guidesInChat: { version: 'latest' } };
    setupGuidesRenderer(props);
    expect(document.head.innerHTML).not.toContain('connectwidget/static/views/renderer');

    props = { guidesInChat: { instanceAlias: undefined, version: undefined } };
    setupGuidesRenderer(props);
    expect(document.head.innerHTML).not.toContain('connectwidget/static/views/renderer');
  });

  it("should insert guides renderer script in head", () => {
    window.connect = {};
    let props = { guidesInChat: { instanceAlias: 'test-instance' } };
    setupGuidesRenderer(props);
    expect(document.head.innerHTML).toContain('<script src="https://test-instance.my.connect.aws/connectwidget/static/views/renderer/latest/index.js"></script>');
    
    props = { guidesInChat: { instanceAlias: 'test-instance', version: 'abcd' }};
    setupGuidesRenderer(props);
    expect(document.head.innerHTML).toContain('<script src="https://test-instance.my.connect.aws/connectwidget/static/views/renderer/abcd/index.js"></script>');
  });

  afterAll(() => {
    delete window.connect;
  });

});
