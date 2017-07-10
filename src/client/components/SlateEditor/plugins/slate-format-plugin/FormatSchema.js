import TableNode from './TableNode';
import TableBodyNode from './TableBodyNode';
import TableHeadNode from './TableHeadNode';
import TableHeadCellNode from './TableHeadCellNode';
import TableRowNode from './TableRowNode';
import TableRowCellNode from './TableRowCellNode';
import DefinitionListNode from './DefinitionListNode';
import DefinitionTermNode from './DefinitionTermNode';
import DefinitionNode from './DefinitionNode';
import DefinitionListSimpleNode from './DefinitionListSimpleNode';
import DefinitionTermSimpleNode from './DefinitionTermSimpleNode';
import DefinitionSimpleNode from './DefinitionSimpleNode';
import AnchorNode from './AnchorNode';
import ParagraphNode from './ParagraphNode';
import HorizontalLineNode from './HorizontalLineNode';
import CodeNode from './CodeNode';
import SoftBreakNode from './SoftBreakNode';
import ImgNode from './ImgNode';
import AbbrNode from './AbbrNode';
import SuperscriptMark from './SuperscriptMark';
import SubscriptMark from './SubscriptMark';
import HighlightMark from './HighlightMark';
import EmojiesMark from './EmojiesMark';

const FormatSchema = {
  marks: {
    mark: HighlightMark,
    sup: SuperscriptMark,
    sub: SubscriptMark,
    emoji: EmojiesMark,
  },
  nodes: {
    table: TableNode,
    thead: TableHeadNode,
    tbody: TableBodyNode,
    tr: TableRowNode,
    th: TableHeadCellNode,
    td: TableRowCellNode,
    dl: DefinitionListNode,
    dt: DefinitionTermNode,
    dd: DefinitionNode,
    'dl-simple': DefinitionListSimpleNode,
    'dt-simple': DefinitionTermSimpleNode,
    'dd-simple': DefinitionSimpleNode,
    anchor: AnchorNode,
    paragraph: ParagraphNode,
    'horizontal-rule': HorizontalLineNode,
    code: CodeNode,
    image: ImgNode,
    abbr: AbbrNode,
    softbreak: SoftBreakNode,
  }
};

export default FormatSchema;
