import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronsUpDown } from "lucide-react";
import { useAliens, useSimilarity } from "@/hooks/useAliens";
import { AlienCard } from "@/components/AlienCard";
import { AlienDetail } from "@/components/AlienDetail";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Alien } from "@/types/alien";

export const Similarity = () => {
  const [searchParams] = useSearchParams();
  const initialAlienId = searchParams.get("alienId") || "";

  const [selectedAlienId, setSelectedAlienId] = useState(initialAlienId);
  const [metric, setMetric] = useState<string>("cosine");
  const [open, setOpen] = useState(false);
  const [selectedAlienForDetail, setSelectedAlienForDetail] = useState<Alien | null>(null);

  const { data: aliens, isLoading: aliensLoading } = useAliens();
  const { data: similarityResults, isLoading: similarityLoading } = useSimilarity(
    selectedAlienId,
    metric
  );

  useEffect(() => {
    if (initialAlienId) {
      setSelectedAlienId(initialAlienId);
    }
  }, [initialAlienId]);

  const selectedAlien = aliens?.find((a) => a.id === selectedAlienId);
  const topSimilar = similarityResults?.similar || [];
  const mostDissimilar = similarityResults?.opposite;

  if (aliensLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <OmnitrixLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-primary text-glow mb-4">
            SIMILARITY EXPLORER
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover aliens with similar or contrasting capabilities
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="holo-card p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label className="font-orbitron text-xs sm:text-sm">SELECT ALIEN</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-10 px-4 rounded-lg justify-between bg-muted border-primary/30 font-orbitron text-sm hover:bg-muted/80 hover:text-foreground uppercase tracking-wider text-primary"
                  >
                    {selectedAlienId
                      ? aliens?.find((alien) => alien.id === selectedAlienId)?.name
                      : "Choose an alien..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 popover-content-omnitrix" align="start">
                  <Command className="bg-transparent">
                    <CommandInput placeholder="Search alien database..." className="font-orbitron border-none" />
                    <CommandList className="custom-scrollbar">
                      <CommandEmpty className="font-orbitron text-sm p-4">No alien found.</CommandEmpty>
                      <CommandGroup>
                        {aliens?.map((alien) => (
                          <CommandItem
                            key={alien.id}
                            value={alien.name}
                            onSelect={() => {
                              setSelectedAlienId(alien.id);
                              setOpen(false);
                            }}
                            className="font-orbitron cursor-pointer px-4 py-2"
                          >
                            {alien.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="font-orbitron text-xs sm:text-sm">SIMILARITY METRIC</Label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="w-full h-10 px-4 rounded-lg border-2 bg-muted border-primary/30 font-orbitron text-sm focus:ring-0 text-primary uppercase tracking-wider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cosine" className="font-orbitron uppercase text-primary">Cosine</SelectItem>
                  <SelectItem value="euclidean" className="font-orbitron uppercase text-primary">Euclidean</SelectItem>
                  <SelectItem value="manhattan" className="font-orbitron uppercase text-primary">Manhattan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {selectedAlienId && (
          <div className="space-y-12">
            {/* Selected Alien */}
            {selectedAlien && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h2 className="font-orbitron text-lg text-muted-foreground mb-4">
                  ANALYZING
                </h2>
                <div className="max-w-xs mx-auto">
                  <AlienCard
                    alien={selectedAlien}
                    onClick={() => setSelectedAlienForDetail(selectedAlien)}
                  />
                </div>
              </motion.div>
            )}

            {similarityLoading ? (
              <div className="flex justify-center py-12">
                <OmnitrixLoader />
              </div>
            ) : (
              <>
                {/* Most Similar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="font-orbitron text-base sm:text-lg text-primary mb-4 sm:mb-6 text-center">
                    TOP 3 SIMILAR ALIENS
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6 max-w-4xl mx-auto">
                    {topSimilar.map((result, index) => (
                      <motion.div
                        key={result.alien.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className={cn(
                          "w-full",
                          // On mobile (grid-cols-2), make the first item span full width (centered top)
                          // On desktop (grid-cols-3), everything is 1 column
                          index === 0 && "col-span-2 md:col-span-1"
                        )}
                      >
                        <AlienCard
                          alien={result.alien}
                          similarity={result.similarity}
                          onClick={() => setSelectedAlienForDetail(result.alien)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Most Dissimilar */}
                {mostDissimilar && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <h2 className="font-orbitron text-lg text-accent mb-6">
                      MOST OPPOSITE ALIEN
                    </h2>
                    <div className="max-w-xs mx-auto">
                      <AlienCard
                        alien={mostDissimilar.alien}
                        similarity={mostDissimilar.similarity}
                        onClick={() => setSelectedAlienForDetail(mostDissimilar.alien)}
                      />
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        )}

        {!selectedAlienId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground font-orbitron">
              Select an alien to begin similarity analysis
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAlienForDetail && (
          <AlienDetail
            alien={selectedAlienForDetail}
            onClose={() => setSelectedAlienForDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

