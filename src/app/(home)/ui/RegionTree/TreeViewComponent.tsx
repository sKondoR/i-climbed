'use client'
import type { IRegionNode } from '@/shared/types/IRegion';
import { useState } from 'react'; 

// Клиентский компонент для отображения дерева и обработки кликов
export function TreeViewComponent({ data }: { data: IRegionNode[] }) {
  const [tree, setTree] = useState<IRegionNode[]>(data);

  const toggleNode = async (id: string) => {
    setTree(prev => {
      const toggleRecursive = (nodes: IRegionNode[]): IRegionNode[] => {
        return nodes.map(node => {
          if (node.id === id) {
            return { ...node, isOpen: !node.isOpen };
          } else if (node.children?.length) {
            return { ...node, children: toggleRecursive(node.children) };
          }
          return node;
        });
      };
      return toggleRecursive(prev);
    });
  };

  const updateNodeChildren = (node: IRegionNode, id: string, children: IRegionNode[]): IRegionNode => {
    if (node.id === id) {
      return { ...node, children, isOpen: true };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateNodeChildren(child, id, children))
      };
    }
    return node;
  };


  const renderTree = (nodes: IRegionNode[]) => {
    return (
      <ul className="ml-4">
        {nodes.map(node => (
          <li key={node.id} className="mb-1">
            <div
              onClick={() => toggleNode(node.id)}
              className="cursor-pointer font-medium hover:text-orange-500 flex items-center"
            >
              {node.children?.length ? (
                <span className="mr-1">
                  {node.isOpen ? '▼' : '►'}
                </span>
              ) : (
                <span className="w-4 mr-1"></span>
              )}
              {node?.country && `${node.country} - `}{node.name}
            </div>
            {node.isOpen && node.children && renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-8">
      <h1 className="font-bold mb-2">Region Tree</h1>
      {renderTree(tree)}
    </div>
  );
};