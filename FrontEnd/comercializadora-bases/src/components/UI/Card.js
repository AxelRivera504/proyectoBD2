import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  style = {},
  onClick,
  hoverable = false 
}) => {
  const cardClass = `ui-card ${hoverable ? 'card-hoverable' : ''} ${className}`.trim();

  return (
    <div 
      className={cardClass} 
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`.trim()}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`.trim()}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`.trim()}>
    {children}
  </div>
);

export const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
  <Card hoverable={true}>
    <CardBody className="stat-card">
      <div className="stat-icon" style={{ color: `var(--${color}-color)` }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <div className="stat-title">{title}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </CardBody>
  </Card>
);

export default Card;