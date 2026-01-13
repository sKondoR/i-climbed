'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { fetchTreeNode } from '@/app/actions/fetchTreeNode';
import { faCaretDown, faCaretRight, faSpinner, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ALLCLIMB_URL } from '@/shared/constants/allclimb.constants';
import type { RecursiveTreeProps, TreeNode } from '@/shared/types/RoutesTree.types';

const TreeNodeComponent: React.FC<{
  node: TreeNode;
  level: number;
  onToggleExpand?: (nodeId: number, isExpanded: boolean) => void;
}> = ({ node, level, onToggleExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<TreeNode[]>(node.children || []);
  const [isLoading, setIsLoading] = useState(false);
  
    const handleToggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);

    // Notify parent if needed (for potential sync or logging)
    if (onToggleExpand) {
      onToggleExpand(node.id, newIsExpanded);
    }

    // Only fetch if expanding and no children are loaded yet
    if (newIsExpanded && !children.length && node.hasChildren && node.link) {
      try {
        const fetchedChildren = await fetchTreeNode(level, node.id);
        setChildren((fetchedChildren || []) as TreeNode[]);
      } catch (error) {
        console.error('Ошибка загрузки данных node:', error);
      }
    }

    setIsLoading(false);
  }, [isExpanded, children.length, node, level, onToggleExpand]);

  const hasChildren = node.hasChildren || children.length > 0;

  return (
    <div className="tree-node">
      <div
        className="flex cursor-pointer items-start"
        style={{ 
          paddingLeft: `${level* 24}px`,
        }}
      >
        {hasChildren && level < 3 && (
          <button
            type="button"
            onClick={handleToggle}
            disabled={isLoading}
            className="cursor-pointer hover:text-orange-500 w-6"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-800" />
            ) : (
              <FontAwesomeIcon className="text-blue-800 hover:text-orange-800" icon={isExpanded ? faCaretDown : faCaretRight} />
            )}
          </button>
        )}
        
        {!(hasChildren && level < 3) && (
          <div style={{ width: '10px', display: 'inline-block' }} />
        )}
        
        <span>
          {node.country && `${node.country} - `}
          {level < 3
            ? <>
              {node.name} 
              {node.numroutes !== undefined ? <span className="text-gray-500 text-sm ml-2">({node.numroutes})</span> : null}
              {node.link 
              ? <a href={`${ALLCLIMB_URL}${node.link}`} className="ml-2 text-blue-800 hover:text-orange-800" target="_blank">
                  <FontAwesomeIcon icon={faExternalLink} />
                </a> : null}
              </>
            : <Link href={`/routes/${node.id}`} className="text-blue-800 hover:text-orange-800">{node.name}</Link>
            }
        </span>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="children-container">
          {children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RecursiveTree: React.FC<RecursiveTreeProps> = ({
  initialData,
}) => {
  const [nodes, setNodes] = useState<TreeNode[]>(initialData);

  // Helper function to update nodes recursively
    const updateNodeInTree = (
    nodes: TreeNode[],
    nodeId: number,
    updates: Partial<TreeNode>
  ): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeInTree(node.children, nodeId, updates),
        };
      }
      return node;
    });
  };

  const handleToggleExpand = useCallback((nodeId: number, isExpanded: boolean) => {
    setNodes((prev) =>
      updateNodeInTree(prev, nodeId, { isExpanded })
    );
  }, []);

  // Add animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .node-content:hover {
        background-color: #f5f5f5;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="recursive-tree" style={{ fontFamily: 'Arial, sans-serif' }}>
      {nodes.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          level={0}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </div>
  );
};

export default RecursiveTree;