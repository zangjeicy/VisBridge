import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NumberCard from '@/components/common/NumberCard.vue';

describe('NumberCard', () => {
  it('renders label and formatted value', () => {
    const wrapper = mount(NumberCard, {
      props: { label: '用户总数', value: 12846 },
    });
    expect(wrapper.find('.card-label').text()).toBe('用户总数');
    expect(wrapper.find('.card-value').text()).toBe('12,846');
  });

  it('formats currency type correctly', () => {
    const wrapper = mount(NumberCard, {
      props: { label: '收入', value: 3456789.5, valueType: 'currency' },
    });
    expect(wrapper.find('.card-value').text()).toBe('¥3,456,789.50');
  });

  it('shows trend when provided', () => {
    const wrapper = mount(NumberCard, {
      props: { label: '用户', value: 1000, trend: 12.5 },
    });
    expect(wrapper.find('.card-trend').exists()).toBe(true);
    expect(wrapper.find('.card-trend.up').exists()).toBe(true);
  });
});
