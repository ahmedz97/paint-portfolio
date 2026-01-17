declare module 'mixitup' {
  interface MixitupOptions {
    selectors?: {
      target?: string;
      control?: string;
    };
    animation?: {
      enable?: boolean;
      duration?: number;
      effects?: string;
    };
    [key: string]: any;
  }

  interface MixitupInstance {
    filter(selector: string): Promise<void>;
    sort(sortString: string): Promise<void>;
    multiFilter(filters: any): Promise<void>;
    destroy(): void;
    [key: string]: any;
  }

  function mixitup(container: HTMLElement, options?: MixitupOptions): MixitupInstance;
  
  export default mixitup;
}

