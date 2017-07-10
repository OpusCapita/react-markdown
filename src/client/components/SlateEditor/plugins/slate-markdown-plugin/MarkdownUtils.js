export const wrapItalicMarkdown = state => state.transform().wrapText('_', '_').focus().apply();

export const wrapBoldMarkdown = state => state.transform().wrapText('**', '**').focus().apply();

export const wrapStrikethroughMarkdown = state => state.transform().wrapText('~~', '~~').focus().apply();
export const wrapInlineCodeMarkdown = state => state.transform().wrapText('`', '`').focus().apply();
export const wrapLinkMarkdown = state => state.transform().wrapText('[', '](http://example.com)').focus().apply();
export const wrapOrderingListMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('1. ', '').focus().apply();
export const wrapUnorderedListMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('* ', '').focus().apply();
export const wrapBlockQuoteMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('> ', '').focus().apply();

export const wrapHeaderOneMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('# ', '').focus().apply();
export const wrapHeaderTwoMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('## ', '').focus().apply();
export const wrapHeaderThreeMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('### ', '').focus().apply();
export const wrapHeaderFourMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('#### ', '').focus().apply();
export const wrapHeaderFiveMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('##### ', '').focus().apply();
export const wrapHeaderSixMarkdown = state => state.transform().moveOffsetsTo(0).wrapText('###### ', '').focus().apply();