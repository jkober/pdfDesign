<?php
namespace Design\DesignBundle\Services\PdfExterno3;
class PhpGenPdfFooterDocu  extends PhpGenPdfSections {
    //--------------------------------------------------------------------------
    function __construct( $head) {
        //----------------------------------------------------------------------
        $this->pdfSec = $head;
        $this->initialize();
        //----------------------------------------------------------------------
    }
    /**
     * Falta ver como lo imprimo si con un salto antes o no. y si crea o no el footer aca.
     * @param \Design\DesignBundle\Services\PdfExterno3\PhpGenPdf $phpGen
     */
    public function write(PhpGenPdf $phpGen) {
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
//        $this->setHeightHead();
        $this->_write($phpGen,false,true);
 //       $phpGen->getPdf()->setDocumentHead();
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
    }
}
?>