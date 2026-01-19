'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { faCaretDown, faCaretRight, faSpinner, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ALLCLIMB_URL } from '@/shared/constants/allclimb.constants';
import type { RecursiveTreeProps, TreeNode } from '@/shared/types/RoutesTree';

const getNode = async (level: number, parentId: number) => {
  try {
    const response = await fetch('/api/tree-node', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ level, parentId }),
    });
    if (response.status !== 200) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.log('error: ', e);
    throw new Error(`Ошибка при загрузке node дерева: ${e}`);
  }
};

const TreeNodeComponent: React.FC<{
  node: TreeNode;
  level: number;
  onToggleExpand?: (nodeId: number, isExpanded: boolean) => void;
  countries?: string[];
  isFirstOfCountry?: boolean;
}> = ({ node, level, onToggleExpand, countries, isFirstOfCountry }) => {
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
        const fetchedChildren = await getNode(level, node.id);
        setChildren((fetchedChildren || []) as TreeNode[]);
      } catch (error) {
        console.error('Ошибка загрузки данных node:', error);
      }
    }

    setIsLoading(false);
  }, [isExpanded, children.length, node, level, onToggleExpand]);

  const hasChildren = node.hasChildren || children.length > 0;

  const nodeBg = level === 0 && node.country && countries ? (countries.indexOf(node.country) % 2 ? '' : 'bg-white/50') : '';
  const padX = level === 0 ? 'px-3 md:px-6' : '';
  const padY = level === 0 ? 'py-1' : '';
  return (
    <div className={`tree-node ${nodeBg} ${padX}`}>
      {isFirstOfCountry && (<div className="text-xl text-ceal-800 mt-1">{node.country}</div>)}
      <div
        className={`flex cursor-pointer items-start ${padY}`}
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const countries = [...new Set(
    nodes
      .map(node => node.country)
      .filter((country): country is string => typeof country === 'string')
  )];
  return (
    <div className="recursive-tree -mx-3 md:-mx-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      {nodes.map((node, index) => (
        <TreeNodeComponent
          isFirstOfCountry={nodes.findIndex(({ country }) => country === node.country) === index}
          key={node.id}
          node={node}
          level={0}
          onToggleExpand={handleToggleExpand}
          countries={countries}
        />
      ))}
    </div>
  );
};

export default RecursiveTree;