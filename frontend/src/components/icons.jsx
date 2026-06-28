const getBaseProps = (props) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  width: props.size || props.width || 24,
  height: props.size || props.height || 24,
  ...props
});

export const MailIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M4.5 7.5 12 12.5l7.5-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LockIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M7.5 10V8a4.5 4.5 0 1 1 9 0v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M6.5 10h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const EyeIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

export const EyeOffIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M4 4 20 20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M6.3 6.9C3.9 8.9 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.3 4.5-1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.4 9.6A3.25 3.25 0 0 0 12 15.25c.6 0 1.2-.16 1.7-.44"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.8 14.4c2.9-1.6 4.4-4.4 6.2-2.4 0 0-3.5-7-9.5-7-.9 0-1.8.1-2.6.3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlateIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
      stroke="currentColor"
      strokeWidth="1.8"
      opacity="0.7"
    />
  </svg>
);

export const ShieldIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 3 20 7v6c0 5-3.4 8.3-8 9.9C7.4 21.3 4 18 4 13V7l8-4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const BoltIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChartIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M4 19V5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M4 19h16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 16v-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 16V8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M16 16v-7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const ListIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M8 6h13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 12h13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 18h13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M4 6h.01M4 12h.01M4 18h.01"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const ClipboardIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M9 5h6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M9.5 3.5h5A1.5 1.5 0 0 1 16 5v0.5H8V5A1.5 1.5 0 0 1 9.5 3.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M7 6.5h10A2.5 2.5 0 0 1 19.5 9v10A2.5 2.5 0 0 1 17 21.5H7A2.5 2.5 0 0 1 4.5 19V9A2.5 2.5 0 0 1 7 6.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const GridIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M5.5 5.5h5v5h-5v-5ZM13.5 5.5h5v5h-5v-5ZM5.5 13.5h5v5h-5v-5ZM13.5 13.5h5v5h-5v-5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const BoxIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M21 8.5 12 13 3 8.5 12 4l9 4.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M21 8.5v8L12 21l-9-4.5v-8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M12 13v8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const UsersIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M16 11.5a3 3 0 1 0-2.999-3 3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 11.5a3 3 0 1 0-2.999-3 3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M3.5 19c.5-3 3-4.5 5.5-4.5S14 16 14.5 19"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M13 14.8c2 .5 3.7 1.9 4.2 4.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const KitchenIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M7 21V11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M7 11c-2.5 0-3.5-2.2-3.5-4.5S4.5 2 7 2v9Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M17 21V2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M17 10a3.5 3.5 0 0 0 0-7v7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const BuildingIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M4.5 21V5.5L12 3l7.5 2.5V21"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 21v-5h6v5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M8 7.5h.01M12 7.5h.01M16 7.5h.01M8 11h.01M12 11h.01M16 11h.01"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const LogoutIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M10 7V6a2 2 0 0 1 2-2h7v16h-7a2 2 0 0 1-2-2v-1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M10 12H4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M6.5 9.5 4 12l2.5 2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const UserIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M4.5 20c1.1-4 4.3-6 7.5-6s6.4 2 7.5 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const PhoneIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M8.5 3.5 6.7 5.3c-.6.6-.8 1.5-.5 2.3 1.2 3.1 3.7 5.6 6.8 6.8.8.3 1.7.1 2.3-.5l1.8-1.8c.6-.6 1.5-.8 2.3-.5l1.2.5c.8.3 1.3 1.2 1.1 2.1-.4 2.1-2.3 3.6-4.5 3.6C11.5 18 6 12.5 6 5.4c0-2.2 1.5-4.1 3.6-4.5.9-.2 1.8.3 2.1 1.1l.5 1.2c.3.8.1 1.7-.5 2.3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const StoreIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M4 10V8l2-4h12l2 4v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M6 10v11h12V10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 21v-7h6v7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const PackageIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 2 20 6.5V17.5L12 22 4 17.5V6.5L12 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M4 6.5 12 11l8-4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M12 11v11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const AlertIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 3 22 20H2L12 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M12 9v4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 17h.01"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const CheckIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M20 6 9 17l-5-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M20.5 20.5 17 17"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const BellIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 21a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 21Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M18 9.5a6 6 0 1 0-12 0c0 6-2 6.5-2 6.5h16s-2-.5-2-6.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="m6 9 6 6 6-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlusIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const MinusIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M5 12h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const DollarIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 3v18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M16.5 7.5c0-1.9-2-3.5-4.5-3.5S7.5 5.6 7.5 7.5 9.5 11 12 11s4.5 1.6 4.5 3.5S14.5 18 12 18s-4.5-1.6-4.5-3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ClockIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FlameIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 22c4 0 7-3 7-7 0-3.6-2.7-5.8-4.3-7.7-.8-1-1.3-2-1.4-3.3-2 1.3-3.3 3.2-3.3 5.6 0 .8.1 1.6.4 2.3-1.5-.7-2.8-2.2-3.1-4.3C5.9 9 5 10.8 5 13c0 5 3 9 7 9Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const SparklesIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M5 13l.8 2.4L8 16l-2.2.6L5 19l-.8-2.4L2 16l2.2-.6L5 13Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      opacity="0.9"
    />
    <path
      d="M19 13l.8 2.4L22 16l-2.2.6L19 19l-.8-2.4L16 16l2.2-.6L19 13Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

export const TrashIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M6 7h12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M8 7l.8 13a2 2 0 0 0 2 1.9h2.4a2 2 0 0 0 2-1.9L18 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M11 11v7M13 11v7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
export const DotsIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SettingsIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrendingUpIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="m22 7-8.5 8.5-5-5L2 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 7h6v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrendingDownIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="m22 17-8.5-8.5-5 5L2 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17h6v-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LayoutIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <rect width="18" height="18" x="3" y="3" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M9 3v18M3 9h18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const OrdersIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path d="M16 2v4M8 2v4m-5 4h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChefIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path d="M6 18h12M6 14h12M6 10h12M9 22h6M12 2v4M5 10a7 7 0 0 1 14 0v4H5v-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const DownloadIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M12 15V3m0 12-4-4m4 4 4-4M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReceiptIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M8 8h8M8 12h8M8 16h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const PrinterIcon = (props) => (
  <svg {...getBaseProps(props)}>
    <path
      d="M6 9V2h12v7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M6 14h12v8H6v-8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);
