export interface TreeNode {
  id: number;
  name: string;
  hasChildren?: boolean;
  link?: string | null;
  country?: string | null;
  numroutes?: number | null;
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
}

export interface RecursiveTreeProps {
  initialData: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
}