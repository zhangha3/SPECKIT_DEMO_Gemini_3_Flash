import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePorts } from '@/composables/usePorts';

describe('usePorts Data Loading', () => {
  beforeEach(() => {
    vi.resetModules();
    // 模拟 fetch 行为
    global.fetch = vi.fn();
  });

  it('should load ports data successfully', async () => {
    const mockPorts = [{ code: 'CNSHA', name_cn: '上海', name_en: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' }];
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockPorts,
    });

    const { ports, loading, error, loadPorts } = usePorts();
    
    expect(loading.value).toBe(false);
    
    // 触发加载
    await loadPorts();
    
    expect(loading.value).toBe(false);
    expect(ports.value).toEqual(mockPorts);
    expect(error.value).toBeNull();
  });

  it('should handle fetch errors', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
    });

    const { ports, error, loadPorts } = usePorts();
    
    await loadPorts();
    
    expect(ports.value).toEqual([]);
    expect(error.value).toBe('数据加载失败，请稍后重试。');
  });

  describe('Search and Filtering', () => {
    const mockPorts = [
      { code: 'CNSHA', name_cn: '上海', name_en: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
      { code: 'SGSIN', name_cn: '新加坡', name_en: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
      { code: 'HKHKG', name_cn: '香港', name_en: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
    ];

    it('should filter ports by exact UN/LOCODE (5 chars)', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockPorts,
      });
      const { loadPorts, searchQuery, filteredPorts } = usePorts();
      await loadPorts();

      searchQuery.value = 'CNSHA';
      expect(filteredPorts.value).toHaveLength(1);
      expect(filteredPorts.value[0].code).toBe('CNSHA');
    });

    it('should fuzzy search by name (CN/EN)', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockPorts,
      });
      const { loadPorts, searchQuery, filteredPorts } = usePorts();
      await loadPorts();

      searchQuery.value = 'Shang';
      expect(filteredPorts.value).toHaveLength(1);
      expect(filteredPorts.value[0].name_en).toBe('Shanghai');

      searchQuery.value = '新加';
      expect(filteredPorts.value).toHaveLength(1);
      expect(filteredPorts.value[0].name_cn).toBe('新加坡');
    });

    it('should be case-insensitive for search', async () => {
        (global.fetch as any).mockResolvedValue({
          ok: true,
          json: async () => mockPorts,
        });
        const { loadPorts, searchQuery, filteredPorts } = usePorts();
        await loadPorts();
  
        searchQuery.value = 'cnsha';
        expect(filteredPorts.value).toHaveLength(1);
        expect(filteredPorts.value[0].code).toBe('CNSHA');
      });
  });
});
