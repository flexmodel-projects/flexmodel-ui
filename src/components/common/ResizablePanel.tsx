import React, {useCallback, useEffect, useRef, useState} from 'react';
import {theme} from 'antd';

type Placement = 'right' | 'left' | 'top' | 'bottom';

interface ResizablePanelProps {
  visible: boolean;
  placement?: Placement;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  handleTitle?: string;
  children: React.ReactNode; // 主内容
  renderPanel: () => React.ReactNode; // 面板内容
  mainStyle?: React.CSSProperties;
  panelStyle?: React.CSSProperties;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  visible,
  placement = 'right',
  defaultSize = 420,
  minSize = 320,
  maxSize = 600,
  handleTitle = '拖动调整尺寸',
  children,
  renderPanel,
  mainStyle,
  panelStyle
}) => {
  const { token } = theme.useToken();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<number>(defaultSize);
  const [isDragging, setIsDragging] = useState(false);

  const isVertical = placement === 'left' || placement === 'right';

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newSize = size;
    switch (placement) {
      case 'right':
        newSize = rect.right - e.clientX; break;
      case 'left':
        newSize = e.clientX - rect.left; break;
      case 'bottom':
        newSize = rect.bottom - e.clientY; break;
      case 'top':
        newSize = e.clientY - rect.top; break;
    }
    const clamped = Math.max(minSize, Math.min(maxSize, newSize));
    setSize(clamped);
  }, [isDragging, placement, minSize, maxSize, size]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = isVertical ? 'ew-resize' : 'ns-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onMouseMove, onMouseUp, isVertical]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'row' : 'column',
    minHeight: 0,
    overflow: 'hidden',
    flex: 1
  };

  const handleThickness = 6;
  const handleCommon: React.CSSProperties = {
    background: isDragging ? token.colorPrimary : token.colorBorder,
    transition: isDragging ? 'none' : 'background-color 0.2s ease',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const innerIndicator: React.CSSProperties = isVertical ? {
    width: '2px',
    height: '20px'
  } : {
    width: '20px',
    height: '2px'
  };

  const handleStyle: React.CSSProperties = {
    ...(isVertical ? { width: `${handleThickness}px`, cursor: 'ew-resize' } : { height: `${handleThickness}px`, cursor: 'ns-resize' }),
    ...handleCommon,
    ...(placement === 'right' ? { borderLeft: `1px solid ${token.colorBorder}` } : {}),
    ...(placement === 'left' ? { borderRight: `1px solid ${token.colorBorder}` } : {}),
    ...(placement === 'bottom' ? { borderTop: `1px solid ${token.colorBorder}` } : {}),
    ...(placement === 'top' ? { borderBottom: `1px solid ${token.colorBorder}` } : {}),
  };

  const indicatorStyle: React.CSSProperties = {
    ...innerIndicator,
    background: isDragging ? token.colorBgContainer : token.colorTextSecondary,
    borderRadius: '1px',
    opacity: isDragging ? 1 : 0.6,
    transition: 'opacity 0.2s ease'
  };

  const panelFixedStyle: React.CSSProperties = isVertical ? {
    width: `${size}px`,
    minWidth: `${size}px`,
    maxWidth: `${size}px`,
    flex: `0 0 ${size}px`,
  } : {
    height: `${size}px`,
    minHeight: `${size}px`,
    maxHeight: `${size}px`,
    flex: `0 0 ${size}px`,
  };

  const panelBorderSide: React.CSSProperties = (placement === 'right') ? { borderLeft: `1px solid ${token.colorBorder}` } :
    (placement === 'left') ? { borderRight: `1px solid ${token.colorBorder}` } :
      (placement === 'bottom') ? { borderTop: `1px solid ${token.colorBorder}` } :
        { borderBottom: `1px solid ${token.colorBorder}` };

  const Panel = (
    <div style={{
      ...panelFixedStyle,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...panelBorderSide,
      ...panelStyle
    }}>
      <div style={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0 }}>
        {renderPanel()}
      </div>
    </div>
  );

  const Handle = (
    <div onMouseDown={onMouseDown} title={handleTitle} style={handleStyle}>
      <div style={indicatorStyle} />
    </div>
  );

  const Main = (
    <div style={{
      display: 'flex',
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      overflow: 'auto',
      ...mainStyle
    }}>
      {children}
    </div>
  );

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* 根据 placement 确定渲染顺序，保证手柄在主内容与面板之间 */}
      {placement === 'left' || placement === 'top' ? (
        <>
          {visible && Panel}
          {visible && Handle}
          {Main}
        </>
      ) : (
        <>
          {Main}
          {visible && Handle}
          {visible && Panel}
        </>
      )}
    </div>
  );
};

export default ResizablePanel;


