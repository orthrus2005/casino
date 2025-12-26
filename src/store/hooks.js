import { useDispatch, useSelector } from 'react-redux';

// Используйте эти хуки вместо обычных useDispatch и useSelector
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;