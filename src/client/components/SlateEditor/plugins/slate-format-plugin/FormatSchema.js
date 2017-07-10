import TableNode from './TableNode';
import TableBodyNode from './TableBodyNode';
import TableHeadNode from './TableHeadNode';
import TableHeadCellNode from './TableHeadCellNode';
import TableRowNode from './TableRowNode';
import TableRowCellNode from './TableRowCellNode';
import HorizontalLineNode from './HorizontalLineNode';
import CodeNode from './CodeNode';
import SoftBreakNode from './SoftBreakNode';
import ImgNode from './ImgNode';
import SuperscriptMark from './SuperscriptMark';
import SubscriptMark from './SubscriptMark';
import HighlightMark from './HighlightMark';

const FormatSchema = {
  marks: {
    mark: HighlightMark,
    sup: SuperscriptMark,
    sub: SubscriptMark,
  },
  nodes: {
    table: TableNode,
    thead: TableHeadNode,
    tbody: TableBodyNode,
    tr: TableRowNode,
    th: TableHeadCellNode,
    td: TableRowCellNode,
    'horizontal-rule': HorizontalLineNode,
    code: CodeNode,
    image: ImgNode,
    softbreak: SoftBreakNode,
  }
};

export default FormatSchema;