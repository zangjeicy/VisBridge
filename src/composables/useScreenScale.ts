import { ref, onMounted, onUnmounted } from 'vue';
import { logger } from '@/logger';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

export function useScreenScale() {
  const scale = ref(1);
  const screenWidth = ref(window.innerWidth);
  const screenHeight = ref(window.innerHeight);

  function calcScale() {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
    const scaleX = screenWidth.value / DESIGN_WIDTH;
    const scaleY = screenHeight.value / DESIGN_HEIGHT;
    scale.value = Math.min(scaleX, scaleY);
    logger.debug('ScreenScale', `Scale: ${scale.value.toFixed(4)}`);
  }

  onMounted(() => {
    calcScale();
    window.addEventListener('resize', calcScale);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', calcScale);
  });

  return { scale, screenWidth, screenHeight };
}
