'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { faCaretDown, faCaretRight, faSpinner, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ALLCLIMB_URL } from '@/shared/constants/allclimb.constants';
import type { RecursiveTreeProps, TreeNode } from '@/shared/types/RoutesTree';

// Кэширование загруженных узлов для избежания повторных запросов
const nodeCache = new Map<string, TreeNode[]>();

const getNode = async (level: number, parentId: number): Promise<TreeNode[]> => {
  const cacheKey = `${level}-${parentId}`;
  if (nodeCache.has(cacheKey)) {
    return nodeCache.get(cacheKey)!;
  }

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
    const data: TreeNode[] = await response.json();
    nodeCache.set(cacheKey, data);
    return data;
  } catch (e) {
    console.log('Ошибка при загрузке узла дерева:', e);
    throw new Error(`Ошибка при загрузке node дерева: ${e instanceof Error ? e.message : String(e)}`);
  }
};

const TreeNodeComponent: React.FC<{
  node: TreeNode;
  level: number;
  onToggleExpand?: (nodeId: number, isExpanded: boolean) => void;
  countryBgClass?: string;
  isFirstOfCountry?: boolean;
}> = ({ node, level, onToggleExpand, countryBgClass, isFirstOfCountry }) => {
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
  const isExpandable = hasChildren && level < 3;
  const paddingLeft = `${level * 24}px`;

  const padX = level === 0 ? 'px-3 md:px-6' : '';
  const padY = level === 0 ? 'py-1' : '';
  return (
    <div className={`tree-node ${countryBgClass ?? ''} ${padX}`}>
      {isFirstOfCountry && (<div className="text-xl text-pink-700 pt-1">{node.country}</div>)}
      <div
        className={`flex cursor-pointer items-start ${padY}`}
        style={{ paddingLeft }}
      >
        {isExpandable ? (
          <button
            type="button"
            onClick={handleToggle}
            disabled={isLoading}
            className="w-6 cursor-pointer hover:text-orange-500 focus:outline-none" 
            aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-800" />
            ) : (
              <FontAwesomeIcon icon={isExpanded ? faCaretDown : faCaretRight} />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}
        
        <span>
          {level < 3
            ? (<>
              {node.name} 
              {node.numroutes !== undefined ? <span className="text-gray-500 text-sm ml-2">({node.numroutes})</span> : null}
              {node.link 
              ? <a
                  href={`${ALLCLIMB_URL}${node.link}`}
                  className="ml-2 text-blue-800 hover:text-orange-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faExternalLink} />
                </a> : null}
              </>)
            : <Link href={`/routes/${node.id}`} className="text-blue-800 hover:text-orange-800">
                {node.name}
              </Link>
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

  const countries = useMemo(
    () =>
      Array.from(
        new Set(
          nodes
            .map((node) => node.country)
            .filter((country): country is string => typeof country === 'string')
        )
      ),
    [nodes]
  );

  const nodesWithMeta = useMemo(
    () =>
      nodes.map((node, index) => ({
        ...node,
        isFirstOfCountry: nodes.findIndex((n) => n.country === node.country) === index,
        countryBgClass: node.country && countries.indexOf(node.country) % 2 === 0 ? 'bg-white/50' : '',
      })),
    [nodes, countries]
  );

  return (
    <div className="recursive-tree -mx-3 md:-mx-6">
      {nodesWithMeta.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          level={0}
          onToggleExpand={handleToggleExpand}
          countryBgClass={node.countryBgClass}
          isFirstOfCountry={node.isFirstOfCountry}
        />
      ))}
    </div>
  );
};

export default RecursiveTree;