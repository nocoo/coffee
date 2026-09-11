import { ArrowUpRight } from 'lucide-react';
import { accessed, sources } from '../data/sources';
import { useCoffee } from '../lib/context';
import { Modal } from './shared';

export function SourcesModal({ onClose }: { onClose: () => void }) {
  const { ui, l } = useCoffee();
  return (
    <Modal title={ui.sourcesTitle} onClose={onClose} className="sources-modal">
      <p className="modal-intro">{ui.sourcesIntro}</p>
      <div className="info-strip">{ui.sourcesNote}</div>
      <div className="source-list">
        {Object.entries(sources).map(([id, source], index) => (
          <div key={id}>
            <span className="micro">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.name}
                <ArrowUpRight size={14} />
              </a>
              <p>{l(source.scope)}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="gentle-note">
        {ui.accessed}: {accessed}
      </p>
      <a
        className="button button-outline"
        href="https://github.com/nocoo/coffee/blob/main/docs/research-sources.md"
        target="_blank"
        rel="noreferrer"
      >
        {ui.researchDoc}
        <ArrowUpRight size={16} />
      </a>
    </Modal>
  );
}
