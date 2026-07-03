/* ── modal.js ── 재사용 가능한 모달 팩토리 ── */

export class Modal {
  constructor(overlayId, modalId, closeBtnId) {
    this.overlay = document.getElementById(overlayId);
    this.modal = document.getElementById(modalId);
    this.closeBtn = document.getElementById(closeBtnId);
    if (!this.overlay || !this.modal) return;

    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.hide());
    this.overlay.addEventListener('click', () => this.hide());
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isActive) this.hide();
    });
  }

  get isActive() { return this.modal?.classList.contains('active'); }

  show() {
    if (!this.modal) return;
    this.overlay.classList.add('active');
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.closeBtn?.focus();
  }

  hide() {
    if (!this.modal) return;
    this.overlay.classList.remove('active');
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /** .srv-error 클래스를 가진 요소에 클릭 이벤트 바인딩 */
  bindTriggers(selector = '.srv-error') {
    document.querySelectorAll(selector).forEach(el => {
      if (el.dataset.modalBound) return;
      el.dataset.modalBound = '1';
      el.addEventListener('click', e => { e.preventDefault(); this.show(); });
    });
  }
}
